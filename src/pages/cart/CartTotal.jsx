import { LiaRupeeSignSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
// import { CiLocationOn } from "react-icons/ci";
// import { IoIosArrowDown } from "react-icons/io";
// import Address from "../../components/Address";
// import { useState } from "react";

function CartTotal({ cart }) {
  // const [changeAddress, setChangeAddress] = useState(false);

  // console.log(cart);
  return (
    <div className="mx-8 my-2 p-10 flex flex-col gap-5 border border-black w-[90%] lg:w-96">
      <div>
        <h1 className=" font-bold text-xl">Cart Totals</h1>
      </div>

      <hr />

      <div className="flex justify-between items-center">
        <p>SUBTOTAL</p>
        <p className="flex justify-center items-center">
          <LiaRupeeSignSolid />
          {cart.pricetotal.toFixed(2)}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p>Discount</p>
        <p className="flex justify-center items-center">
          <LiaRupeeSignSolid />-{cart.totalDiscount.toFixed(2)}
        </p>
      </div>

      <hr />

      <div className="flex justify-between items-center">
        <p>Shipping Charges</p>
        <p className="flex justify-center items-center">
          <LiaRupeeSignSolid />
          {cart.shippingCharges.toFixed(2)}
        </p>
      </div>

      {/* <div onClick={() => setChangeAddress(!changeAddress)}>
        <h1 className="flex items-center gap-1">
          <CiLocationOn />
          Change Address
          <IoIosArrowDown />
        </h1>
      </div> */}
      {/* <div>
        {changeAddress && (
          <>
            <Address />
            <button className="border-2 border-black px-6 py-2 text-gray-600 text-sm ml-2">
              Update
            </button>
          </>
        )}
      </div> */}

      <hr />

      <div className="flex justify-between items-center">
        <p>GST</p>
        <p className="flex justify-center items-center">
          <LiaRupeeSignSolid />
          {cart.gstamount.toFixed(2)}
        </p>
      </div>

      <hr />

      <div className="flex justify-between items-center">
        <p>TOTAL</p>
        <p className="flex justify-center items-center">
          <LiaRupeeSignSolid />
          {cart.total.toFixed(2)}
        </p>
      </div>

      <div>
        <Link to={"/checkout"}>
          <button className="bg-black text-white p-3 w-full rounded-sm">
            Proceed to checkout
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CartTotal;
