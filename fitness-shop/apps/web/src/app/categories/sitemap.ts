    


import { getCategories } from '@/lib/products'
import type { MetadataRoute } from 'next'
 
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}
 
export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories()

  return categories.map((category) => ({
            url: `${process.env.BASE_URL}/categories/${category.id}`,
            priority: 0.5,
        }))
}