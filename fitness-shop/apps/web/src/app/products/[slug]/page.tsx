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

      <main>
        <Link href="/" className="muted">
          ← Zpět na produkty
        </Link>

        <div className="product-detail">
          <section className="card">
            {mainImage && (
              <img
                src={getImageUrl(mainImage.imageUrl)}
                alt={mainImage.altText ?? product.name}
                className="product-detail-main-image"
              />
            )}

            {product.images.length > 1 && (
              <div className="product-detail-thumbnails">
                {product.images.slice(1).map((image) => (
                  <img
                    key={image.id}
                    src={getImageUrl(image.imageUrl)}
                    alt={image.altText ?? product.name}
                    className="product-detail-thumbnail"
                  />
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <p className="muted">
              {product.categories.map((category) => category.name).join(", ")}
            </p>

            <h1>{product.name}</h1>
            <p>{product.description}</p>

            <h2>
              {product.price} {product.currency}
            </h2>

            <div style={{ marginTop: 24 }}>
              <h3>Dostupné varianty</h3>
              <ul>
                {product.variants.map((variant) => (
                  <li key={variant.id}>
                    {variant.name} — skladem {variant.stockQuantity} ks
                  </li>
                ))}
              </ul>
            </div>

            <AddToCart product={product} />
          </section>
        </div>
      </main>
    </>
  );
}