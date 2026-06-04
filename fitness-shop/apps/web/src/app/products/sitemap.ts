import { getProducts } from '@/lib/products'
import type { MetadataRoute } from 'next'
 
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}
 
export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()

  return products.map((product) => ({
            url: `${process.env.BASE_URL}/products/${product.id}`,
            priority: 0.5,
        }))
}