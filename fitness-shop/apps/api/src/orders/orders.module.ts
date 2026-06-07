import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [AuthModule, DatabaseModule, MailModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}