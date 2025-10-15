import type { NextApiRequest, NextApiResponse } from "next";

import products from "@/utils/data/products";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req);
  const baseUrl = "https://www.shaktitriautoparts.online";

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${products
    .map(
      (product) => `
    <url>
      <loc>${baseUrl}/products/${product.id}-${product.productId}</loc>
      <lastmod>daily</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `,
    )
    .join("")}
</urlset>
`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
}
