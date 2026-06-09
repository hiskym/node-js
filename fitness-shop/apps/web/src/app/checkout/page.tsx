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
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/cart" className="text-sm text-zinc-600 hover:text-zinc-950">
        ← Zpět do košíku
      </Link>

      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Dokončení objednávky
        </h1>
        <p className="mt-1 text-zinc-600">
          Vyplň kontaktní údaje a zkontroluj souhrn objednávky.
        </p>
      </div>

      {items.length === 0 ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Košík je prázdný</h2>
          <p className="mt-2 text-zinc-600">
            Nejdřív si přidej produkt do košíku.
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Zpět na produkty
          </Link>
        </section>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="grid gap-6">
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Kontaktní údaje</h2>

                <div className="mt-5 grid gap-3">
                  <input
                    className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                    placeholder="Jméno a příjmení"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />

                  <input
                    className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />

                  <input
                    className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                    placeholder="Telefon"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Doprava</h2>
                <label className="mt-4 flex items-center gap-2 text-sm">
                  <input type="radio" checked readOnly />
                  Osobní odběr
                </label>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Platba</h2>
                <label className="mt-4 flex items-center gap-2 text-sm">
                  <input type="radio" checked readOnly />
                  Platba při převzetí
                </label>
              </section>

              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Poznámka</h2>
                <textarea
                  className="mt-4 min-h-32 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Volitelná poznámka k objednávce"
                />
              </section>
            </div>

            <aside className="h-fit lg:sticky lg:top-28">
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Souhrn objednávky</h2>

                <div className="mt-5 grid gap-4">
                  {items.map((item) => (
                    <div
                      key={item.variantId}
                      className="grid grid-cols-[60px_1fr_auto] gap-3"
                    >
                      {item.imageUrl ? (
                        <img
                          src={getImageUrl(item.imageUrl)}
                          alt={item.productName}
                          className="h-15 w-15 rounded-lg object-cover"
                        />
                      ) : (
                        <div />
                      )}

                      <div>
                        <strong className="text-sm">{item.productName}</strong>
                        <div className="text-xs text-zinc-600">
                          {item.variantName} × {item.quantity}
                        </div>
                      </div>

                      <div className="text-sm font-medium">
                        {(Number(item.unitPrice) * item.quantity).toFixed(2)}{" "}
                        {item.currency}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2 border-t border-zinc-200 pt-5 text-sm">
                  <div className="flex justify-between">
                    <span>Produkty</span>
                    <span>
                      {totalPrice} {currency}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Doprava</span>
                    <span>Zdarma</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Platba</span>
                    <span>Zdarma</span>
                  </div>

                  <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-bold">
                    <span>Celkem</span>
                    <span>
                      {totalPrice} {currency}
                    </span>
                  </div>
                </div>

                <label className="mt-5 flex items-start gap-2 text-sm">
                  <input type="checkbox" required className="mt-1" />
                  <span>
                    Souhlasím se{" "}
                    <Link href="/privacy-policy" target="_blank" className="underline">
                      zpracováním osobních údajů
                    </Link>
                  </span>
                </label>

                {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

                <button
                  type="submit"
                  className="mt-5 w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Odesílám..." : "Dokončit objednávku"}
                </button>
              </section>
            </aside>
          </div>
        </form>
      )}
    </main>
  );
}