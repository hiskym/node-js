import Link from "next/link";
import type { Product } from "@/lib/types";
import { getImageUrl } from "@/lib/image-url";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <Link href={`/products/${product.slug}`} className="card product-card">
      {image && (
        <img
          src={getImageUrl(image.imageUrl)}
          alt={image.altText ?? product.name}
          className="product-card-image"
        />
      )}

      <div>
        <h3>{product.name}</h3>
        <p className="muted">{product.shortDescription}</p>
        <strong>
          {product.price} {product.currency}
        </strong>
      </div>
    </Link>
  );
}