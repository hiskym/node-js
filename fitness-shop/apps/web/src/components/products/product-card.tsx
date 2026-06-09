import Link from "next/link";
import type { Product } from "@/lib/types";
import { getImageUrl } from "@/lib/image-url";
import { Card } from "@/components/ui/card";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <Card className="h-full overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-md">
        {image && (
          <img
            src={getImageUrl(image.imageUrl)}
            alt={image.altText ?? product.name}
            className="h-48 w-full object-cover"
          />
        )}

        <div className="p-5">
          <h3 className="font-semibold group-hover:underline">{product.name}</h3>

          <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
            {product.shortDescription}
          </p>

          <strong className="mt-4 block">
            {product.price} {product.currency}
          </strong>
        </div>
      </Card>
    </Link>
  );
}