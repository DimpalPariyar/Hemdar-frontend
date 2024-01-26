import { useSelector } from "react-redux";
import CartProduct from "./CartProduct";
import CartTotal from "./CartTotal";

function Cart() {
  const cart = useSelector((state) => state.cart.cart);
  console.log(cart);
  return (
    <div className="my-20 ">
      <h1 className="text-center font-semibold text-4xl font-primary">Cart</h1>
      <div className="flex m-4 gap-10">
        <div className="basis-2/3">
          <CartProduct />
        </div>
        <div className="basis-1/3">
          <CartTotal />
        </div>
      </div>
    </div>
  );
}

export default Cart;
