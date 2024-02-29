import axios from "axios";
import { useGetCartDetailsQuery } from "../../apiSlice/addToCartApiSlice";
import CartProduct from "./CartProduct";
import CartTotal from "./CartTotal";

function Cart() {
  const {
    data: cart,
    isSuccess,
    isLoading,
    isError,
    refetch,
  } = useGetCartDetailsQuery();
  // const cart = useSelector(getCart);
  console.log(cart, isError, isLoading, isSuccess);

  async function handleRemoveFromCart(id) {
    try {
      const res = await axios(`http://localhost:3004/cart/${id}`);
      console.log(res.data);
      if (res.data) refetch();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="my-20 ">
      <h1 className="text-center font-semibold text-4xl font-primary">Cart</h1>
      <div className="flex flex-col m-4 gap-10 lg:flex-row">
        <div className="basis-2/3">
          {isSuccess && (
            <CartProduct
              isSuccess={isSuccess}
              cart={cart}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          )}
        </div>
        <div className="basis-1/3">
          {isSuccess && <CartTotal cart={cart} />}
        </div>
      </div>
    </div>
  );
}

export default Cart;
