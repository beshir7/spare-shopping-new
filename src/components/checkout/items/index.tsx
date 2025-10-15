import { useSelector } from "react-redux";

import type { RootState } from "@/store";

interface CartItem {
  id: string | number;
  name: string;
  thumb: string;
  price: number;
}

const CheckoutItems = () => {
  const { cartItems } = useSelector((state: RootState) => state.cart);

  return (
    <ul className="checkout-items">
      {cartItems.map((item: CartItem) => (
        <li key={item.id} className="checkout-item">
          <div className="checkout-item__content">
            <div className="checkout-item__img">
              <img src={item.thumb} alt={item.name} />
            </div>

            <div className="checkout-item__data">
              <h3>{item.name}</h3>
              <span>#{item.id}</span>
            </div>
          </div>
          <h3>₹{item.price}</h3>
        </li>
      ))}
    </ul>
  );
};

export default CheckoutItems;
