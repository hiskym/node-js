"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { createOrder } from "@/lib/orders";
import { getImageUrl } from "@/lib/image-url";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, currency, clearCart } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Košík je prázdný.");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        customer: {
          name,
          email,
          phone,
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        note: note || undefined,
      });

      clearCart();
      router.push(`/thank-you?order=${order.orderNumber}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Objednávku se nepodařilo vytvořit.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={{ padding: 32, maxWidth: 720 }}>
      <Link href="/cart">← Zpět do košíku</Link>

      <h1>Checkout</h1>

      {items.length === 0 ? (
        <p>Košík je prázdný.</p>
      ) : (
        <>
          <section style={{ marginBottom: 32 }}>
            <h2>Souhrn objednávky</h2>

            {items.map((item) => (
              <div key={item.variantId} style={{ marginBottom: 12 }}>
                <strong>{item.productName}</strong>
                <div>
                  {item.variantName} × {item.quantity}
                </div>
                <div>
                  {(Number(item.unitPrice) * item.quantity).toFixed(2)} {item.currency}                </div>
              </div>
            ))}

            <h3>
              Celkem: {totalPrice} {currency}
            </h3>

            <p>
              Doprava: <strong>Osobní odběr</strong>
            </p>
            <p>
              Platba: <strong>Dobírka / platba při převzetí</strong>
            </p>
          </section>

          <form onSubmit={handleSubmit}>
            <div className="checkout-layout">
              <div className="checkout-left">
                <section className="card">
                  <h2>Kontaktní údaje</h2>

                  <div className="form-grid">
                    <input
                      className="input"
                      placeholder="Jméno a příjmení"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />

                    <input
                      className="input"
                      type="email"
                      placeholder="E-mail"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />

                    <input
                      className="input"
                      placeholder="Telefon"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                    />
                  </div>
                </section>

                <section className="card">
                  <h2>Doprava</h2>

                  <label>
                    <input type="radio" checked readOnly /> Osobní odběr
                  </label>
                </section>

                <section className="card">
                  <h2>Platba</h2>

                  <label>
                    <input type="radio" checked readOnly /> Platba při převzetí
                  </label>
                </section>

                <section className="card">
                  <h2>Poznámka</h2>

                  <textarea
                    className="textarea"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Volitelná poznámka k objednávce"
                  />
                </section>
              </div>

              <aside className="checkout-summary">
                <section className="card">
                  <h2>Souhrn objednávky</h2>

                  <div className="checkout-items">
                    {items.map((item) => (
                      <div className="checkout-item">
                        <img
                          src={getImageUrl(item.imageUrl)}
                          alt={item.productName}
                          width={60}
                          height={60}
                        />
                        <div>
                          <strong>{item.productName}</strong>

                          <div className="muted">
                            {item.variantName} × {item.quantity}
                          </div>
                        </div>

                        <div>
                          {(Number(item.unitPrice) * item.quantity).toFixed(2)}{" "}
                          {item.currency}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-total">
                    <div className="checkout-total-price">
                      {totalPrice} {currency}
                    </div>

                    <p className="muted">
                      Osobní odběr · Platba při převzetí
                    </p>
                  </div>

                  <label className="checkbox-row">
                    <input type="checkbox" required />

                    <span>
                      Souhlasím se{" "}
                      <Link href="/privacy-policy" target="_blank">
                        zpracováním osobních údajů
                      </Link>
                    </span>
                  </label>

                  {error && (
                    <p style={{ color: "var(--danger)" }}>
                      {error}
                    </p>
                  )}

                  <button
                    className="button"
                    disabled={isSubmitting}
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    {isSubmitting
                      ? "Odesílám..."
                      : "Dokončit objednávku"}
                  </button>
                </section>
              </aside>
            </div>
          </form>
        </>
      )}
    </main>
  );
}