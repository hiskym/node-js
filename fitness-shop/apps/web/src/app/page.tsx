import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { getCategories, getProducts } from "@/lib/products";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <main>
      <section className="hero">
        <p className="muted">Fitness vybavení pro domácí i silový trénink</p>
        <h1>Jednoduchý e-shop s fitness pomůckami</h1>
        <p>
          Kettlebelly, expandéry, magnézium a pomůcky pro regeneraci na jednom
          místě.
        </p>
        <Link className="button" href="#products">
          Zobrazit produkty
        </Link>
      </section>

      <section>
        <h2>Kategorie</h2>

        <div className="category-list">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="button secondary"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section id="products">
        <div className="page-header">
          <div>
            <h2>Produkty</h2>
            <p className="muted">Vyber si pomůcky podle svého tréninku.</p>
          </div>
        </div>

        <div className="grid product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}