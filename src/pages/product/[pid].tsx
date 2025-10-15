import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import type { ParsedUrlQuery } from "querystring"; // For type definitions
import { useState } from "react";
import useSWR from "swr";

import Breadcrumb from "@/components/breadcrumb";
import Footer from "@/components/footer";
import Content from "@/components/product-single/content";
import Description from "@/components/product-single/description";
import Gallery from "@/components/product-single/gallery";
import Reviews from "@/components/product-single/reviews";
import ProductsFeatured from "@/components/products-featured";
// types
import type { ProductType } from "@/types";

import Layout from "../../layouts/Main";
import { server } from "../../utils/server";

type ProductPageType = {
  productId: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all product IDs to generate static paths for all products
  const res = await fetch(`${server}/api/products`);
  const data = await res.json();

  // Generate paths for each product
  const paths = data.map((product: { id: number }) => ({
    params: { pid: product.id.toString() },
  }));

  return { paths, fallback: "blocking" }; // 'blocking' allows fallback rendering
};

interface Params extends ParsedUrlQuery {
  pid: string; // pid is a string in the URL
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { pid } = params as Params; // Type assertion here

  // Return only the product ID for SWR to fetch data client-side
  return { props: { productId: pid } };
};

const Product = ({ productId }: ProductPageType) => {
  // Initialize state hook before useSWR is called
  const [showBlock, setShowBlock] = useState("description");

  // Use SWR to fetch product data
  const { data: product, error } = useSWR<ProductType>(
    `/api/product/${productId}`,
  );

  // Handle loading and error states
  if (error) return <div>Failed to load product</div>;
  if (!product) return <div>Loading...</div>;

  // Generate structured data for the product
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.vehicle_description,
    image: product.images,
    sku: product.productId,
    productID: product.productId,
    category: product.vehicle_category,
    brand: {
      "@type": "Brand",
      name: "ShaktiTri Auto Parts",
    },
    offers: {
      "@type": "Offer",
      price: product.currentPrice,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `https://shaktitri.com/product/${productId}`,
    },
  };

  return (
    <>
      <Head>
        <title>
          {product.name} - Part ID: {product.productId} | ShaktiTri Auto Parts
        </title>
        <meta
          name="description"
          content={`Buy ${product.name} (Part ID: ${product.productId}) at the best price. ${product.vehicle_description}`}
        />
        <meta
          name="keywords"
          content={`${product.name}, ${product.productId}, ${product.vehicle_category}, auto parts, vehicle parts, buy online`}
        />
        <meta
          property="og:title"
          content={`${product.name} - Part ID: ${product.productId} | ShaktiTri Auto Parts`}
        />
        <meta
          property="og:description"
          content={`Buy ${product.name} (Part ID: ${product.productId}) at the best price. ${product.vehicle_description}`}
        />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:type" content="product" />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <Layout>
        <Breadcrumb />

        <section className="product-single">
          <div className="container">
            <div className="product-single__content">
              <Gallery images={product.images} />
              <Content product={product} />
            </div>

            <div className="product-single__info">
              <div className="product-single__info-btns">
                <button
                  type="button"
                  onClick={() => setShowBlock("description")}
                  className={`btn btn--rounded ${showBlock === "description" ? "btn--active" : ""}`}
                >
                  Description
                </button>
                <button
                  type="button"
                  onClick={() => setShowBlock("reviews")}
                  className={`btn btn--rounded ${showBlock === "reviews" ? "btn--active" : ""}`}
                >
                  Reviews ({product.reviews.length})
                </button>
              </div>

              <Description
                productDesc={product.vehicle_description}
                show={showBlock === "description"}
              />
              <Reviews product={product} show={showBlock === "reviews"} />
            </div>
          </div>
        </section>

        {/* SEO-friendly product information section */}
        <section
          className="product-seo-info"
          style={{
            padding: "20px",
            marginTop: "20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <div className="container">
            <h2>Product Information</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <div style={{ flex: "1 1 300px" }}>
                <h3>Part Details</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li style={{ marginBottom: "10px" }}>
                    <strong>Part ID:</strong> {product.productId}
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <strong>Product Name:</strong> {product.name}
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <strong>Category:</strong> {product.vehicle_category}
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    <strong>Price:</strong> ₹{product.currentPrice}
                  </li>
                </ul>
              </div>
              <div style={{ flex: "1 1 300px" }}>
                <h3>Product Description</h3>
                <p>{product.vehicle_description}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="product-single-page">
          <ProductsFeatured />
        </div>
        <Footer />
      </Layout>
    </>
  );
};

export default Product;
