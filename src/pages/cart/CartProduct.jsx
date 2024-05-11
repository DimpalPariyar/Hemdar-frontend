import { IoIosArrowBack } from "react-icons/io";
import { GiCancel } from "react-icons/gi";
import { Link } from "react-router-dom";
// import { FaMinus, FaPlus } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useState } from "react";

function CartProduct({ cart, handleRemoveFromCart }) {
  /*eslint-disable no-unused-vars*/
  const [count, setCount] = useState(1);

  function countIncrement() {
    setCount((prev) => prev + 1);
  }
  function countDecrement() {
    if (count > 1) {
      setCount((prev) => prev - 1);
    } else {
      setCount(1);
    }
  }

  return (
    <div className="mx-10 lg:mx-5">
      <div className="p-4">
        <Link to={"/products"}>
          <h1 className="flex gap-1 items-center">
            <IoIosArrowBack />
            Continue Shopping
          </h1>
        </Link>
      </div>
      <hr />
      <div className="p-2">
        {/* {products.map((item) => ( */}
        <>
          {cart?.Cart?.items.length > 0 &&
            cart?.Cart?.items.map((item) => (
              <div className="flex flex-col" key={item._id}>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleRemoveFromCart(item.productId._id)}
                  >
                    <GiCancel />
                  </button>
                </div>

                <div
                  key={item._id}
                  className="flex items-start gap-5 py-2 px-4"
                >
                  <div className="size-36">
                    <Link to={`/products/${item.productId._id}/${item.title}`}>
                      <img
                        src={item.productId?.images[0]}
                        key={item.productId._id}
                        className=" size-36"
                      />
                    </Link>
                  </div>

                  <div className="flex items-start justify-between gap-10 basis-9/12 ">
                    <div className="flex flex-col gap-2">
                      <h1>{item.productId.title}</h1>
                      <p>{item.productId.category}</p>
                      <p>Rs.{item.productId.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => countDecrement()}>
                        <FiMinus />
                      </button>

                      <input value={count} type="text" className="w-7" />

                      <button onClick={() => countIncrement()}>
                        <FiPlus />
                      </button>
                    </div>
                    <div className="flex justify-center items-center">
                      <LiaRupeeSignSolid />
                      {item.productId.discountedPrice
                        ? item.productId.discountedPrice
                        : item.productId.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </>
      </div>

      {/* <div className="flex flex-col gap-2 font-primary my-4">
        <input
          type="text"
          placeholder="Coupon code"
          className=" border-2 border-gray-300 py-3 w-64 px-2 "
        />
        <button className=" py-3 w-64 bg-gray-200">Apply coupon</button>
      </div> */}
    </div>
  );
}

export default CartProduct;
