import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

type OrderEmailItem = {
  productName: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  currency: string;
};

type OrderEmailInput = {
  to: string;
  customerName: string;
  orderNumber: string;
  total: string;
  currency: string;
  items: OrderEmailItem[];
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });

  async sendOrderConfirmation(input: OrderEmailInput) {
    const from = process.env.MAIL_FROM ?? 'Fitness Shop <noreply@example.com>';

    await this.transporter.sendMail({
      from,
      to: input.to,
      subject: `Potvrzení objednávky ${input.orderNumber}`,
      html: this.renderCustomerOrderEmail(input),
    });
  }

  async sendAdminOrderNotification(input: OrderEmailInput) {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      this.logger.warn('ADMIN_EMAIL is not set, skipping admin notification');
      return;
    }

    const from = process.env.MAIL_FROM ?? 'Fitness Shop <noreply@example.com>';

    await this.transporter.sendMail({
      from,
      to: adminEmail,
      subject: `Nová objednávka ${input.orderNumber}`,
      html: this.renderAdminOrderEmail(input),
    });
  }

  private renderCustomerOrderEmail(input: OrderEmailInput) {
    return `
      <h1>Děkujeme za objednávku</h1>
      <p>Dobrý den, ${input.customerName},</p>
      <p>vaše objednávka byla úspěšně přijata.</p>

      <p>
        <strong>Číslo objednávky:</strong><br />
        ${input.orderNumber}
      </p>

      ${this.renderItems(input.items)}

      <p>
        <strong>Celkem:</strong> ${input.total} ${input.currency}
      </p>

      <p>
        Doprava: osobní odběr<br />
        Platba: při převzetí
      </p>
    `;
  }

  private renderAdminOrderEmail(input: OrderEmailInput) {
    return `
      <h1>Nová objednávka</h1>

      <p>
        <strong>Objednávka:</strong> ${input.orderNumber}<br />
        <strong>Zákazník:</strong> ${input.customerName}<br />
        <strong>E-mail:</strong> ${input.to}
      </p>

      ${this.renderItems(input.items)}

      <p>
        <strong>Celkem:</strong> ${input.total} ${input.currency}
      </p>
    `;
  }

  private renderItems(items: OrderEmailItem[]) {
    return `
      <table cellpadding="8" cellspacing="0" border="1">
        <thead>
          <tr>
            <th align="left">Produkt</th>
            <th align="left">Varianta</th>
            <th align="right">Množství</th>
            <th align="right">Cena/ks</th>
            <th align="right">Celkem</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.variantName ?? ''}</td>
                  <td align="right">${item.quantity}</td>
                  <td align="right">${item.unitPrice} ${item.currency}</td>
                  <td align="right">${item.totalPrice} ${item.currency}</td>
                </tr>
              `,
            )
            .join('')}
        </tbody>
      </table>
    `;
  }
}