import { some } from "lodash";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";
import { toggleFavProduct } from "@/store/reducers/user";
import type { ProductTypeList } from "@/types";

const ProductItem = ({
  discount,
  images,
  id,
  name,
  price,
  currentPrice,
  vehicle_category,
  productId,
}: ProductTypeList) => {
  const dispatch = useDispatch();
  const { favProducts } = useSelector((state: RootState) => state.user);

  const isFavourite = some(favProducts, (productId) => productId === id);

  const toggleFav = () => {
    dispatch(
      toggleFavProduct({
        id,
      }),
    );
  };

  // Generate product URL
  const productUrl = `/product/${id}`;

  return (
    <article
      className="product-item"
      itemScope
      itemType="https://schema.org/Product"
    >
      <div className="product__image">
        <button
          type="button"
          onClick={toggleFav}
          className={`btn-heart ${isFavourite ? "btn-heart--active" : ""}`}
          aria-label={
            isFavourite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <i className="icon-heart" />
        </button>

        <Link href={productUrl}>
          <img
            src={images ? images[0] : ""}
            alt={`${name} - ${vehicle_category}`}
            itemProp="image"
          />
          {discount && (
            <span className="product__discount" itemProp="discount">
              {discount}% OFF
            </span>
          )}
        </Link>
      </div>
      <div className="product__description">
        <h3 itemProp="name">{name}</h3>
        <div
          className={`product__price ${discount ? "product__price--discount" : ""}`}
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <h4>
            <meta itemProp="price" content={currentPrice?.toString() || ""} />₹
            {currentPrice}
          </h4>
          {discount && (
            <span>
              <meta itemProp="price" content={price?.toString() || ""} />₹
              {price}
            </span>
          )}
          <meta itemProp="priceCurrency" content="INR" />
          <meta itemProp="availability" content="https://schema.org/InStock" />
        </div>
        <meta itemProp="category" content={vehicle_category} />
        <meta itemProp="productID" content={productId || id} />
        <meta itemProp="sku" content={productId || id} />
      </div>
    </article>
  );
};

export default ProductItem;
