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
    <main>
      <Link href="/" className="muted">
        ← Zpět
      </Link>

      <div className="page-header">
        <div>
          <h1>Vyhledávání</h1>
          <p className="muted">
            Výsledky pro: <strong>{q || "všechny produkty"}</strong>
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <section className="card">
          <h2>Nic jsme nenašli</h2>
          <p className="muted">Zkus jiný výraz.</p>
        </section>
      ) : (
        <div className="grid product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}