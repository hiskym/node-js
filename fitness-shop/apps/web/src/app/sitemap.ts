import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {  

    return [
        {
            url: "http://localhost:3000",
            priority: 1,
        },
        {
            url: "http://localhost:3000/search",
            priority: 0.5,
        },
        {
            url: "http://localhost:3000/products",
            priority: 0.5,
        },
        {
            url: "http://localhost:3000/categories",
            priority: 0.5,
        },
    ];
}



