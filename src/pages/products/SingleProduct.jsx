// import { useEffect, useState } from "react";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { IoCartOutline } from "react-icons/io5";
import { useAddToCartMutation } from "../../apiSlice/addToCartApiSlice";
import { useFormik } from "formik";
import { countRefetch } from "../../reduxStoreSlice/countSlice";
import { useGetSingleProductQuery } from "../../apiSlice/addProductApiSlice";
import { useEffect, useState } from "react";
import DialogBox from "../../components/DialogBox";
import { useAddToWishlistMutation } from "../../apiSlice/addToWishlistApiSlice";

function SingleProduct() {
  /*eslint-disable no-unused-vars*/
  const [isOpen, setIsOpen] = useState(false);
  function handleClose() {
    setIsOpen(false);
  }

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [productdata, setproductdata] = useState({
    category: "",
    price: 0,
    images: [],
    status: "",
    description: "",
  });

  // const prodSize = ["S", "M", "L", "XL", "XXl"];
  // const prodSize = singleProduct.sizes;

  const { _id, title } = useParams();
  const refetchCount = useSelector((state) => state.count);

  const { data: singleProduct, isSuccess } = useGetSingleProductQuery(_id);
  // console.log(singleProduct);
  useEffect(() => {
    if (isSuccess) {
      setproductdata(singleProduct);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSuccess]);

  // const [products, setProducts] = useState({
  //   category: "",
  //   price: 0,
  //   images: [],
  //   status: "",
  //   description: "",
  // });

  // useEffect(
  //   function () {
  //     async function fetchData() {
  //       try {
  //         const res = await fetch("/products.json");
  //         const data = await res.json();
  //         const product = data.filter((p) => p._id === _id);
  //         console.log(product);
  //         setProducts(product[0]);
  //       } catch (error) {
  //         console.log("Error fecthing data:", error);
  //       }
  //     }
  //     fetchData();
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   },
  //   [_id]
  // );

  const {
    images,
    description,
    material,
    category,
    status,
    stock,
    length,
    breath,
    height,
    productweight,
    color,
    price,
    discountedPrice,
    brand,
    shippingCharges,
    shippingdetails,
    isActive,
  } = productdata;

  const [addToCart, { data, error, isLoading }] = useAddToCartMutation();

  const dispatch = useDispatch();

  const [addToWishlist, { data: wishlist }] = useAddToWishlistMutation();

  function handleAddToWishlist() {
    addToWishlist(singleProduct._id);
    console.log(singleProduct);
  }
  function handleAddToCart(data) {
    if (!isLoggedIn) {
      setIsOpen(!isOpen);
      return;
    }

    const newItem = {
      productId: singleProduct._id,
      quantity: data.quantity,
      size: data.size,
      sizequantity: 1,
      color: singleProduct.color,
      // _id: singleProduct._id,
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

  const [activeImage, setActiveImage] = useState(0);

  function activeImageTab(i) {
    setActiveImage(i);
  }
  return (
    <>
      <DialogBox isOpen={isOpen} onClose={handleClose}>
        <div className="bg-white border border-black p-10 rounded-md ml-[550px] mt-[250px]">
          <h1 className="text-center font-semibold font-primary text-xl">
            PLEASE LOG IN
          </h1>
          <p className="text-center text-gray-500 font-primary mb-4">
            Login to add items in your cart.
          </p>
          <Link to={"/login"}>
            <button className=" bg-black  text-white border rounded-lg font-primary font-bold border-black p-1 w-56">
              LOGIN
            </button>
          </Link>
        </div>
      </DialogBox>

      {singleProduct && (
        <div className="mt-20 max-w-screen-2xl container mx-auto xl:px-28 px-4">
          <div className="p-3 max-w-7xl m-auto">
            <div className="mt-5">
              <Link to={"/"} className="text-gray-600">
                Home
              </Link>
              <Link to={"/products"} className=" text-black">
                / Shop
              </Link>
              <Link to={"/products"} className=" text-black">
                / {category}
              </Link>
              <Link to={"/products"} className="font-bold text-black">
                / {title}
              </Link>
            </div>
            <div className="mt-2 sm:mt-10">
              <div className="flex gap-8">
                {/* <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6 h-max"> */}
                <div className="flex gap-6">
                  <div className="flex flex-col gap-4 size-28">
                    {images.map((img, i) => (
                      <img
                        src={`../../${img}`}
                        className={`mx-auto h-72 w-[600px] ${
                          activeImage === i ? " scale-[1.1]" : ""
                        }`}
                        key={i}
                        onClick={() => activeImageTab(i)}
                      />
                    ))}
                  </div>
                  <div>
                    {
                      <img
                        src={`../../${images[activeImage]}`}
                        className="mx-auto h-96 w-80"
                      />
                    }
                  </div>
                </div>

                <div className="">
                  <h1 className="text-3xl font-semibold capitalize text-left my-2">
                    {title}
                  </h1>
                  <p className="flex  flex-col text-gray-600 text-justify sm:text-left sm:mt-4">
                    {category}
                    <span className=" font-light text-xs">by {brand}</span>
                  </p>

                  <span className="my-2 text-xl text-yellow-400 flex items-center gap-1 sm:my-4">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </span>

                  <div className="flex gap-3 mt-4">
                    {discountedPrice && (
                      <p className="flex text-gray-400 items-center text-xl font-light line-through sm:text-2xl">
                        <LiaRupeeSignSolid />
                        <span className=" ">{price}</span>
                      </p>
                    )}
                    <p className="flex items-center text-xl font-semibold sm:text-2xl">
                      <LiaRupeeSignSolid />
                      <span className=" ">
                        {discountedPrice ? discountedPrice : price}
                      </span>
                    </p>

                    {discountedPrice && (
                      <p className="flex border-red-400 border rounded-full px-2 text-red-400 items-center text-sm font-semibold">
                        {`${(100 - (discountedPrice / price) * 100).toFixed(
                          2
                        )}% Off`}
                      </p>
                    )}
                  </div>

                  <p className="mt-3 w-fit border rounded-full px-2 text-green-500 border-green-500">
                    {stock} in stock
                  </p>

                  <p className="text-gray-600 text-justify sm:text-left sm:mt-4">
                    {description}
                  </p>
                  <p className="mt-1 text-gray-600 text-justify sm:text-left sm:mt-4">
                    <span className="font-semibold text-black">Material: </span>
                    {material}
                  </p>
                  <p className="mt-1 text-gray-600 text-justify sm:text-left sm:mt-4">
                    <span className="font-semibold text-black">Size: </span>
                    {length} (length) x {breath} (breath) x {height} (height)
                  </p>
                  <p className="mt-1 text-gray-600 text-justify sm:text-left sm:mt-4">
                    <span className="font-semibold text-black">
                      Product Weight:{" "}
                    </span>
                    {productweight}
                  </p>
                  <p className="mt-1 text-gray-600 text-justify sm:text-left sm:mt-4">
                    <span className="font-semibold text-black">Colour: </span>
                    {color}
                  </p>
                  <p className="mt-1 text-gray-600 text-justify sm:text-left sm:mt-4">
                    <span className="font-semibold text-black">
                      Shipping Details:{" "}
                    </span>
                    {shippingCharges}
                  </p>

                  <form onSubmit={handleSubmit}>
                    {/* <div className="my-2">
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
                    </div> */}

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
                        <button
                          onClick={handleAddToWishlist}
                          className="flex justify-center items-center gap-2 w-full py-3 px-4 font-bold border border-black rounded-md lg:m-0 md:px-6 "
                        >
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
