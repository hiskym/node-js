import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { getProducts } from "@/lib/products";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Vyhledávání",
  description: "Vyhledávání produktů ve Fitness Shopu.",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const products = await getProducts(q);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Zpět
      </Link>

      <section className="mt-6 mb-10">
        <p className="text-sm font-medium text-zinc-500">Vyhledávání</p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Výsledky hledání
        </h1>

        <p className="mt-4 text-zinc-600">
          Výsledky pro: <strong>{q || "všechny produkty"}</strong>
        </p>
      </section>

      {products.length === 0 ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold">Nic jsme nenašli</h2>
          <p className="mt-2 text-zinc-600">Zkus jiný výraz.</p>
        </section>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}