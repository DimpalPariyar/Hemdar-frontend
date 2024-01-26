import { IoIosArrowBack } from "react-icons/io";
import { GiCancel } from "react-icons/gi";
import { Link } from "react-router-dom";
// import { FaMinus, FaPlus } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useSelector } from "react-redux";
import { getCart } from "./CartSlice";

// const products = [
//   {
//     id: 1,
//     title: "hand bag",
//     category: "Bag",
//     price: 63.85,
//     image: "../src/images/Hand_Bag.png",
//     status: "new arrivals",
//   },
//   {
//     id: 2,
//     title: "Yellow earing",
//     category: "Earing",
//     price: 130.0,
//     image: "../src/images/earing.png",
//     status: "new arrivals",
//   },
// ];

function CartProduct() {
  const cart = useSelector(getCart);
  console.log(cart);

  return (
    <div className="mx-5">
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
        {cart.map((item) => (
          <div className="flex flex-col" key={item.id}>
            <div className="flex justify-end">
              <button>
                <GiCancel />
              </button>
            </div>

            <div key={item.id} className="flex items-start gap-5 py-2 px-4">
              <div className="size-36">
                <Link to={"/"}>
                  <img src={item.image} key={item.id} className=" size-36" />
                </Link>
              </div>

              <div className="flex items-start justify-between gap-10 basis-9/12 ">
                <div>
                  <h1>{item.title}</h1>
                  <p>{item.category}</p>
                  <p>Rs.{item.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button>
                    <FiMinus />
                  </button>

                  <input
                    type="number"
                    defaultValue={1}
                    className=" text-center w-10 h-8"
                  />

                  <button>
                    <FiPlus />
                  </button>
                </div>

                <div className="flex justify-center items-center">
                  <LiaRupeeSignSolid />
                  {item.price}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 font-primary my-4">
        <input
          type="text"
          placeholder="Coupon code"
          className=" border-2 border-gray-300 py-3 w-64 px-2 "
        />
        <button className=" py-3 w-64 bg-gray-200">Apply coupon</button>
      </div>
    </div>
  );
}

export default CartProduct;
