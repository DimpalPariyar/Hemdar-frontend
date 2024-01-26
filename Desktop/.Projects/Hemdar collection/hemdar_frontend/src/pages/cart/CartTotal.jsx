import { LiaRupeeSignSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

function CartTotal() {
  return (
    <div className="m-2 p-10 flex flex-col gap-5 border border-black w-96">
      <div>
        <h1 className=" font-bold text-xl">Cart Totals</h1>
      </div>

      <hr />

      <div className="flex justify-between items-center">
        <p>SUBTOTAL</p>
        <p className="flex justify-center items-center">
          <LiaRupeeSignSolid />
          100
        </p>
      </div>

      <hr />

      <div className="flex justify-between items-center">
        <p>Coupoun Discount</p>
        <p className="flex justify-center items-center">
          <LiaRupeeSignSolid />
          10
        </p>
      </div>

      <hr />

      <div className="flex justify-between items-center">
        <p>GST</p>
        <p className="flex justify-center items-center">
          <LiaRupeeSignSolid />5
        </p>
      </div>

      <hr />

      <div className="flex justify-between items-center">
        <p>TOTAL</p>
        <p className="flex justify-center items-center">
          <LiaRupeeSignSolid />
          105
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
