import { useEffect, useState } from "react";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addItem } from "../cart/CartSlice";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { IoCartOutline } from "react-icons/io5";

function SingleProduct() {
  /*eslint-disable no-unused-vars*/

  const { id, title } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(
    function () {
      async function fetchData() {
        try {
          const res = await fetch("/products.json");
          const data = await res.json();
          const product = data.filter((p) => p.id == id);
          console.log(product);
          setProducts(product[0]);
        } catch (error) {
          console.log("Error fecthing data:", error);
        }
      }
      fetchData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [id]
  );

  const { category, price, image, status, description } = products;
  console.log(products);

  const dispatch = useDispatch();
  function handleAddToCart() {
    const newItem = {
      id: products.id,
      image: products.image,
      category: products.category,
      price: products.price,
      title: products.title,
    };
    console.log(newItem);
    dispatch(addItem(newItem));
  }

  return (
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
            <div>
              <img src={`../../${image}`} className="w-full" />
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

              <div className="my-2">
                <h1 className="my-4">SELECT SIZE</h1>
                <ul className="flex gap-4">
                  <li className="border border-black rounded-full text-lg px-2.5">
                    S
                  </li>
                  <li className="border border-black rounded-full text-lg px-2.5">
                    M
                  </li>
                  <li className="border border-black rounded-full text-lg px-2.5">
                    L
                  </li>
                  <li className="border border-black rounded-full text-lg px-2.5">
                    XL
                  </li>
                  <li className="border border-black rounded-full text-lg px-2.5">
                    XXL
                  </li>
                </ul>
              </div>

              <div className="mt-4">
                <div className="text-left flex flex-col gap-2 w-full">
                  <label className="font-semibold ">Quantity</label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    defaultValue={1}
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
                    onClick={() => handleAddToCart()}
                    className="flex justify-center items-center gap-2 w-full py-3 px-4 font-bold border border-black rounded-md lg:m-0 md:px-6 "
                  >
                    <IoCartOutline />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
