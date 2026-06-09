import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { getCategories, getProducts } from "@/lib/products";
import { ButtonLink } from "@/components/ui/button";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="mb-10 rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">
          Fitness vybavení pro domácí i silový trénink
        </p>

        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
          Jednoduchý e-shop s fitness pomůckami
        </h1>

        <p className="mt-4 max-w-2xl text-zinc-600">
          Kettlebelly, expandéry, magnézium a pomůcky pro regeneraci na jednom
          místě.
        </p>

        <ButtonLink href="#products" className="mt-6">
          Zobrazit produkty
        </ButtonLink>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold">Kategorie</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section id="products">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Produkty</h2>
          <p className="mt-1 text-zinc-600">
            Vyber si pomůcky podle svého tréninku.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}