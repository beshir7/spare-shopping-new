import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import Breadcrumb from "@/components/breadcrumb";
import Footer from "@/components/footer";
import ProductsContent from "@/components/products-content";
import ProductsFilter from "@/components/products-filter";
import { products } from "@/utils/data/products";

import Layout from "../layouts/Main";

// Define the type for the filters
interface Filters {
  productType: string[]; // Array of selected product types
  priceRange: [number, number]; // Price range as a tuple
}

const Products = () => {
  const router = useRouter();
  // Explicitly define the state type for filters
  const [filters, setFilters] = useState<Filters>({
    productType: [],
    priceRange: [20, 150],
  });

  // Function to handle the application of filters
  const handleFiltersApply = (
    selectedFilters: Record<string, string[]>,
    priceRange: [number, number],
  ) => {
    setFilters({
      productType: selectedFilters["product-type"] || [],
      priceRange,
    });
  };

  // Generate product keywords for SEO
  const productKeywords = products
    .map(
      (product) =>
        `${product.name} ${product.productId} ${product.vehicle_category}`,
    )
    .join(", ");

  return (
    <Layout>
      <Head>
        <title>Our Products - Find Your Perfect Vehicle Parts</title>
        <meta
          name="description"
          content="Browse our extensive collection of high-quality vehicle parts. Find products by ID, name, or category. Competitive prices and wide selection available."
        />
        <meta
          name="keywords"
          content={`vehicle parts, auto parts, car parts, motorcycle parts, product catalog, parts search, ${productKeywords}`}
        />

        {/* Open Graph tags for better social sharing */}
        <meta
          property="og:title"
          content="Vehicle Parts Catalog - Find Your Perfect Parts"
        />
        <meta
          property="og:description"
          content="Browse our extensive collection of high-quality vehicle parts. Find products by ID, name, or category."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={router.asPath} />

        {/* Schema.org markup for Google */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: products.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: product.name,
                description: product.vehicle_description,
                productID: product.productId,
                sku: product.productId,
                category: product.vehicle_category,
                url: `${router.asPath}/${product.id}`,
              },
            })),
          })}
        </script>
      </Head>
      <Breadcrumb />
      <section className="products-page">
        <div className="container">
          <ProductsFilter onApplyFilters={handleFiltersApply} />
          <ProductsContent filters={filters} />

          {/* SEO-friendly product listing section */}
          <div
            className="seo-product-list"
            style={{
              marginTop: "40px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <h2>Our Product Catalog</h2>
            <p>Find our products by part ID, name, or category:</p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {products.map((product) => (
                <li
                  key={product.id}
                  style={{
                    marginBottom: "10px",
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <strong>Part ID: {product.productId}</strong> - {product.name}{" "}
                  ({product.vehicle_category})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </Layout>
  );
};

export default Products;
