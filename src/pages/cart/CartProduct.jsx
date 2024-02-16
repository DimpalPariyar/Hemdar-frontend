import { IoIosArrowBack } from "react-icons/io";
import { GiCancel } from "react-icons/gi";
import { Link } from "react-router-dom";
// import { FaMinus, FaPlus } from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useGetCartDetailsQuery } from "../../apiSlice/addToCartApiSlice";
import axios from "axios";

function CartProduct() {
  async function handleRemoveFromCart(id) {
    try {
      const res = await axios(`http://localhost:3004/cart/${id}`);
      console.log(res.data);
      if (res.data) refetch();
    } catch (error) {
      console.log(error);
    }
  }

  const {
    data: cart,
    isSuccess,
    isLoading,
    isError,
    refetch,
  } = useGetCartDetailsQuery();
  // const cart = useSelector(getCart);
  console.log(cart, isError, isLoading, isSuccess);

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
        <>
          {cart?.items.length > 0 &&
            cart?.items.map((item) => (
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
                    <Link to={"/"}>
                      <img
                        src={item.productId?.images[0]}
                        key={item.productId._id}
                        className=" size-36"
                      />
                    </Link>
                  </div>

                  <div className="flex items-start justify-between gap-10 basis-9/12 ">
                    <div>
                      <h1>{item.productId.title}</h1>
                      <p>{item.productId.category}</p>
                      <p>Rs.{item.productId.price}</p>
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
                      {item.productId.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </>
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
