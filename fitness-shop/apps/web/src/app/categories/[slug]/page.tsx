import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { apiFetch } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import type { Metadata } from "next";

type CategoryProductsResponse = {
  category: Category;
  products: Product[];
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await apiFetch<CategoryProductsResponse>(
      `/categories/${slug}/products`,
      {
        cache: "no-store",
      },
    );

    return {
      title: data.category.name,
      description:
        data.category.description ??
        `Produkty v kategorii ${data.category.name}.`,
    };
  } catch {
    return {
      title: "Kategorie nenalezena",
    };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const data = await apiFetch<CategoryProductsResponse>(
    `/categories/${slug}/products`,
    {
      cache: "no-store",
    },
  );

  return (
    <main>
      <Link href="/" className="muted">
        ← Zpět
      </Link>

      <div className="page-header">
        <div>
          <h1>{data.category.name}</h1>
          <p className="muted">{data.category.description}</p>
        </div>
      </div>

      <div className="grid product-grid">
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}