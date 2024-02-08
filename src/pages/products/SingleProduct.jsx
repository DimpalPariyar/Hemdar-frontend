import { useEffect, useState } from "react";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { addItem } from "../cart/CartSlice";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { IoCartOutline } from "react-icons/io5";
import { useAddToCartMutation } from "../../apiSlice/addToCartApiSlice";
import { useFormik } from "formik";
import { countRefetch } from "../../reduxStoreSlice/countSlice";

function SingleProduct() {
  /*eslint-disable no-unused-vars*/

  const prodSize = ["S", "M", "L", "XL", "XXl"];

  const { _id, title } = useParams();
  const refetchCount = useSelector((state) => state.count);
  const [products, setProducts] = useState({
    category: "",
    price: 0,
    images: [],
    status: "",
    description: "",
  });

  useEffect(
    function () {
      async function fetchData() {
        try {
          const res = await fetch("/products.json");
          const data = await res.json();
          const product = data.filter((p) => p._id === _id);
          console.log(product);
          setProducts(product[0]);
        } catch (error) {
          console.log("Error fecthing data:", error);
        }
      }
      fetchData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [_id]
  );

  const { category, price, images, status, description } = products;
  console.log(products);

  const [addToCart, { data, error, isLoading }] = useAddToCartMutation();

  const dispatch = useDispatch();
  function handleAddToCart(data) {
    const newItem = {
      productId: products._id,
      quantity: data.quantity,
      size: data.size,
      sizequantity: 1,
      color: products.color,
      // _id: products._id,
      // images: products.images,
      // category: products.category,
      // price: products.price,
      // title: products.title,
    };
    addToCart(newItem);
    console.log(newItem);
    dispatch(countRefetch(!refetchCount.count));
  }

  const { values, handleSubmit, handleChange, setValues } = useFormik({
    initialValues: {
      size: "",
      quantity: 1,
    },
    onSubmit: handleAddToCart,
  });
  console.log(values);
  return (
    <>
      {products && (
        <div className="mt-20 max-w-screen-2xl container mx-auto xl:px-28 px-4">
          <div className="p-3 max-w-7xl m-auto">
            <div className="mt-5">
              <a href="/" className="text-gray-600">
                Home
              </a>
              <a href="/products" className=" text-black">
                / Shop
              </a>
              <a href="/products" className=" text-black">
                / {category}
              </a>
              <a href="/products" className="font-bold text-black">
                / {title}
              </a>
            </div>
            <div className="mt-2 sm:mt-10">
              <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6 h-max">
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img, i) => (
                    <img
                      src={`../../${img}`}
                      className="mx-auto h-72 w-[600px]"
                      key={i}
                    />
                  ))}
                </div>

                <div>
                  <h1 className="text-3xl font-semibold capitalize text-left my-8">
                    {title}
                  </h1>
                  <p className="mt-3 text-gray-600 text-base leading-6 text-justify sm:text-left sm:mt-4">
                    {description}
                  </p>
                  <span className="my-2 text-xl text-yellow-400 flex items-center gap-1 sm:my-4">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </span>

                  <p className="flex items-center text-xl font-semibold sm:text-2xl">
                    <LiaRupeeSignSolid />
                    <span>{price}</span>
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="my-2">
                      <label htmlFor="selectSize" className=" my-4">
                        Select Size
                      </label>

                      <ul className="flex gap-4">
                        {prodSize.map((s) => (
                          <li
                            className={`border border-black rounded-full text-lg px-2.5 hover:border-red-500 hover:text-red-500 ${
                              values.size === s
                                ? "bg-red-400 text-white border-none"
                                : ""
                            }`}
                            onClick={() =>
                              setValues({
                                ...values,
                                size: s,
                              })
                            }
                            key={s}
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4">
                      <div className="text-left flex flex-col gap-2 w-full">
                        <label className="font-semibold ">Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          id="quantity"
                          onChange={handleChange}
                          defaultValue={values.quantity}
                          required
                          className="border broder-gray-300 text-sm font-semibold mb-1 max-w-full w-full outline-none rounded-md m-0 py-3 px-4 md:py-3 md:px-4 focus:border-red-500"
                        />
                      </div>
                      <div className="w-full text-left my-4">
                        <button className="flex justify-center items-center gap-2 w-full py-3 px-4 font-bold border border-black rounded-md lg:m-0 md:px-6 ">
                          <FaRegHeart />
                          Wishlist
                        </button>
                      </div>
                      <div className="w-full text-left my-4">
                        <button
                          onClick={handleSubmit}
                          className="flex justify-center items-center gap-2 w-full py-3 px-4 font-bold border border-black rounded-md lg:m-0 md:px-6 hover:bg-red-400 hover:text-white "
                        >
                          <IoCartOutline />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SingleProduct;
