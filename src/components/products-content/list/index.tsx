import useSwr from "swr";

import type { ProductTypeList } from "@/types";

import ProductItem from "../../product-item";
import ProductsLoading from "./loading";

interface Filters {
  productType: string[];
  priceRange: [number, number];
}

interface ProductsContentProps {
  filters: Filters;
}

const ProductsContent = ({ filters }: ProductsContentProps) => {
  console.log("ProductsFilters.tsx", filters);

  const { productType, priceRange } = filters;

  // Prepare the URL with the filters as query parameters
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  // Generate filter query parameters
  const generateQueryParams = () => {
    const params: URLSearchParams = new URLSearchParams();

    if (productType.length > 0) {
      params.append("productType", productType.join(","));
    }
    if (priceRange) {
      params.append("minPrice", priceRange[0].toString());
      params.append("maxPrice", priceRange[1].toString());
    }

    return params.toString();
  };

  // Use SWR hook to fetch the products data
  const { data, error } = useSwr(
    `/api/products?${generateQueryParams()}`,
    fetcher,
  );

  if (error) return <div>Failed to load products</div>;
  console.log("dataaa: ", data);

  // Filter the data on the client-side if necessary
  const filterProducts = (products: ProductTypeList[]) => {
    return products.filter((product) => {
      const isProductTypeMatch =
        productType.length > 0
          ? productType.includes(product.vehicle_category)
          : true;

      // Convert product.price to number before comparing
      const productPrice = Number(product.price);
      const isPriceInRange =
        !isNaN(productPrice) &&
        productPrice >= priceRange[0] &&
        productPrice <= priceRange[1];

      return isProductTypeMatch && isPriceInRange;
    });
  };

  const filteredProducts = data ? filterProducts(data) : [];

  return (
    <>
      {!data && <ProductsLoading />}

      {filteredProducts.length > 0 && (
        <section className="products-list">
          {filteredProducts.map((item: ProductTypeList) => (
            <ProductItem
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              color={item.color}
              currentPrice={item.currentPrice}
              images={item.images}
              vehicle_category={item.vehicle_category}
              productId={item.productId}
            />
          ))}
        </section>
      )}

      {filteredProducts.length === 0 && <p>No products match your filters.</p>}
    </>
  );
};

export default ProductsContent;
