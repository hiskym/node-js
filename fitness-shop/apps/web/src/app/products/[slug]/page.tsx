import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/cart/add-to-cart";
import { getProduct } from "@/lib/products";
import type { Metadata } from "next";
import { getImageUrl } from "@/lib/image-url";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await getProduct(slug);
    const image = product.images[0];

    return {
      title: product.name,
      description: product.shortDescription ?? product.description,
      openGraph: {
        title: product.name,
        description: product.shortDescription ?? product.description,
        images: image
          ? [
            {
              url: getImageUrl(image.imageUrl),
              alt: image.altText ?? product.name,
            },
          ]
          : [],
      },
      alternates: {
        canonical: `/products/${product.slug}`,
      },
    };
  } catch {
    return {
      title: "Produkt nenalezen",
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  let product;

  try {
    product = await getProduct(slug);
  } catch {
    notFound();
  }

  const mainImage = product.images[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.shortDescription ?? product.description,

    image: product.images.map((image) =>
      getImageUrl(image.imageUrl),
    ),

    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability:
        product.variants.some((v) => v.stockQuantity > 0)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />

    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-950">
        ← Zpět na produkty
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          {mainImage && (
            <img
              src={getImageUrl(mainImage.imageUrl)}
              alt={mainImage.altText ?? product.name}
              className="max-h-[520px] w-full rounded-xl object-cover"
            />
          )}

          {product.images.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {product.images.slice(1).map((image) => (
                <img
                  key={image.id}
                  src={getImageUrl(image.imageUrl)}
                  alt={image.altText ?? product.name}
                  className="h-24 w-24 rounded-xl object-cover"
                />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">
            {product.categories.map((category) => category.name).join(", ")}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            {product.name}
          </h1>

          <p className="mt-4 leading-7 text-zinc-700">{product.description}</p>

          <AddToCart product={product} />
        </section>
      </div>
    </main>
  </>
);
}