"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { getImageUrl } from "@/lib/image-url";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, currency } = useCart();

  //TODO: nezobrazuje se spravne obrazek

  return (
    <main>
      <div className="page-header">
        <div>
          <h1>Košík ({items.length})</h1>
          <p className="muted">Zkontroluj položky před dokončením objednávky.</p>
        </div>
      </div>

      {items.length === 0 ? (
        <section className="card">
          <h2>Košík je prázdný</h2>

          <p className="muted">
            Přidej si produkty do košíku.
          </p>

          <Link href="/" className="button">
            Prohlédnout produkty
          </Link>
        </section>
      ) : (
        <>
          <section className="card">
            <div className="grid">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="cart-item"
                >
                  {item.imageUrl ? (
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.productName}
                      className="cart-item-image"
                    />
                  ) : (
                    <div />
                  )}

                  <div>
                    <Link href={`/products/${item.slug}`}>
                      <strong>{item.productName}</strong>
                    </Link>

                    <p className="muted">
                      {item.variantName}
                    </p>

                    <p>
                      {item.unitPrice} {item.currency}
                    </p>
                  </div>

                  <div>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        updateQuantity(item.variantId, Math.max(1, value));
                      }}
                    />

                    <button
                      className="button secondary"
                      style={{ marginTop: 8 }}
                      onClick={() =>
                        removeItem(item.variantId)
                      }
                    >
                      Odstranit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            className="card"
            style={{ marginTop: 24 }}
          >
            <div className="cart-summary">
              <div>
                <h2>
                  Celkem: {totalPrice} {currency}
                </h2>

                <p className="muted">
                  Platba při převzetí · Osobní odběr
                </p>
              </div>

              <Link
                href="/checkout"
                className="button"
              >
                Pokračovat k objednávce
              </Link>
            </div>
          </section>
        </>
      )}
      <Link
        href="/"
        className="button secondary"
      >
        Pokračovat v nákupu
      </Link>
    </main>
  );
}