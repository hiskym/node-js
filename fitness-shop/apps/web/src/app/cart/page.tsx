"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { getImageUrl } from "@/lib/image-url";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, currency } = useCart();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Košík ({items.length})
        </h1>
        <p className="mt-1 text-zinc-600">
          Zkontroluj položky před dokončením objednávky.
        </p>
      </div>

      {items.length === 0 ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Košík je prázdný</h2>
          <p className="mt-2 text-zinc-600">
            Zatím jsi nepřidal žádný produkt.
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Přejít na produkty
          </Link>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="grid gap-4 border-b border-zinc-200 pb-5 last:border-0 last:pb-0 md:grid-cols-[100px_1fr_auto] md:items-center"
                >
                  {item.imageUrl ? (
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.productName}
                      className="h-28 w-full rounded-xl object-cover md:h-24 md:w-24"
                    />
                  ) : (
                    <div />
                  )}

                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-semibold hover:underline"
                    >
                      {item.productName}
                    </Link>

                    <p className="mt-1 text-sm text-zinc-600">{item.variantName}</p>

                    <p className="mt-2 text-sm">
                      {item.unitPrice} {item.currency}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <input
                      className="w-24 rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(
                          item.variantId,
                          Math.max(1, Number(event.target.value)),
                        )
                      }
                    />

                    <button
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-50"
                      onClick={() => removeItem(item.variantId)}
                    >
                      Odstranit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">
                  Celkem: {totalPrice} {currency}
                </h2>

                <p className="mt-1 text-zinc-600">
                  Platba při převzetí · Osobní odběr
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
                >
                  Pokračovat v nákupu
                </Link>

                <Link
                  href="/checkout"
                  className="inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                >
                  Pokračovat k objednávce
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}