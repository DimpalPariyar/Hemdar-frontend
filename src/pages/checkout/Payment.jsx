import { Link } from "react-router-dom";
import { useGetCartDetailsQuery } from "../../apiSlice/addToCartApiSlice";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { CgAsterisk } from "react-icons/cg";

function Payment({ handleSubmit }) {
  const { data: cart, isSuccess } = useGetCartDetailsQuery();
  // console.log(cart);
  // console.log(cart.Cart.items[length].productId.images[0]);

  return (
    isSuccess && (
      <div className="m-4 p-4 flex flex-col gap-4">
        <h1 className="text-xl mb-8 font-semibold">Your order</h1>
        <div className="">
          {cart?.Cart?.items.length > 0 &&
            cart?.Cart?.items.map((item) => (
              <div key={item.productId._id} className="flex justify-between">
                <div className="flex gap-2 my-2">
                  <img
                    src={item.productId?.images[0]}
                    key={item.productId._id}
                    className="w-12 h-10 rounded-md"
                  />
                  <p>{item.productId.title}</p>
                  <p className="text-white bg-gray-600 rounded-full px-2 items-center flex text-sm h-5">
                    x {item.quantity}
                  </p>
                </div>
                <p className="flex items-center">
                  <LiaRupeeSignSolid />
                  {item.productId.price.toFixed(2)}
                </p>
              </div>
            ))}
        </div>
        <hr />
        <div className="flex justify-between ">
          <p>SUBTOTAL</p>
          <p className="flex items-center">
            <LiaRupeeSignSolid />
            {(cart.pricetotal - cart.totalDiscount).toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between ">
          <p>SHIPPING</p>
          <p className="flex items-center">
            <LiaRupeeSignSolid />
            {cart.shippingCharges.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between ">
          <p>GST</p>
          <p className="flex items-center">
            <LiaRupeeSignSolid />
            {cart.gstamount.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between ">
          <p>TOTAL</p>
          <p className="flex items-center">
            <LiaRupeeSignSolid />
            {cart.total.toFixed(2)}
          </p>
        </div>
        <div className="border-2 border-black p-4">
          <p>Credit Card/Debit Card/NetBanking</p>
          <p>Pay Securely using UPI, Cards, or NetBanking</p>
        </div>

        <div className="mx-2">
          <input type="checkbox" className="mt-2 mr-2 float-left" />
          <p className="text-justify">
            I would like to receive exclusive emails with discounts and product
            information (optional)
          </p>
        </div>
        <div>
          <p className="text-justify text-gray-500 text-sm">
            Your personal data will be used to process your order, support your
            experience throughout this website, and for other purposes described
            in our{" "}
            <Link to={"/shippingpolicy"}>
              <span className="text-black hover:border-b-2 hover:border-black">
                privacy policy
              </span>
            </Link>
            .
          </p>
        </div>
        <div className="">
          <input type="checkbox" className="mt-2 mr-2 float-left" />
          <p className="text-justify text-gray-500">
            I have read and agree to the website{" "}
            <Link to={"/termsandconditions"}>
              <span className="flex text-black hover:underline hover:underline-offset-4">
                terms and conditions
                <CgAsterisk className="text-sm text-gray-500" />
              </span>
            </Link>
          </p>
        </div>
        <div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-black text-white w-full p-2"
          >
            Place Order
          </button>
        </div>
      </div>
    )
  );
}

export default Payment;
