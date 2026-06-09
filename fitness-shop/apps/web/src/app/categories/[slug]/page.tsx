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
      alternates: {
        canonical: `/categories/${data.category.slug}`,
      },
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
    <main className="mx-auto max-w-7xl px-6 py-10">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← Zpět
      </Link>

      <section className="mt-6 mb-10">
        <p className="text-sm font-medium text-zinc-500">
          Kategorie
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          {data.category.name}
        </h1>

        {data.category.description && (
          <p className="mt-4 max-w-3xl text-zinc-600">
            {data.category.description}
          </p>
        )}
      </section>

      {data.products.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold">
            Kategorie je zatím prázdná
          </h2>

          <p className="mt-2 text-zinc-600">
            V této kategorii momentálně nejsou žádné produkty.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </main>
  );
}