import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
} from "../apiSlice/addToWishlistApiSlice";
import axios from "axios";
import { BASE_URL } from "../../config";
import {
  useAddToCartMutation,
  useGetCartDetailsQuery,
} from "../apiSlice/addToCartApiSlice";

function Cards({ item, wishlist, refetchWishlist }) {
  const [wishlistProductId, setWishlistProductId] = useState([]);

  const [addToWishlist] = useAddToWishlistMutation();
  const [addToCart] = useAddToCartMutation();
  const { data: wishlistedProducts, refetch } = useGetWishlistQuery();
  const [refetchState, setrefetchState] = useState(false);

  /*eslint-disable no-unused-vars*/

  // jidjsahfs
  //ndouaofsd
  const {
    data: cart,
    isSuccess,
    refetch: refetchCart,
  } = useGetCartDetailsQuery();

  const [cartProducts, setCartProducts] = useState(false);

  function initCart() {
    const cartItems = cart?.Cart.items
      .map((product) => product.productId._id)
      .includes(item._id);
    setCartProducts(cartItems);
    console.log(cartItems);
  }
  // console.log(cartProducts);

  useEffect(() => {
    if (isSuccess) {
      initCart();
    }
  }, [refetchState, isSuccess]);

  useEffect(() => {
    if (wishlistedProducts) {
      setWishlistProductId(() => {
        const productid = wishlistedProducts.items.map((id) => id._id);
        return [...productid];
      });
    }
  }, [wishlistedProducts, refetch]);

  function handleAddToCart() {
    const newItem = {
      productId: item._id,
      quantity: 1,
      size: "",
      sizequantity: 1,
      color: item.color,
    };
    addToCart(newItem)
      .then(() => refetchCart())
      .then(() => initCart())
      .then(() => setrefetchState(true));
  }

  async function handleRemoveFromWishlist(id) {
    try {
      const res = await axios(`${BASE_URL}/cart/wishlist/${id}`);
      // console.log(res.data);
      if (res.data) refetchWishlist();
    } catch (error) {
      console.log(error);
    }
  }

  async function toggleWishlist() {
    if (wishlistProductId.includes(item._id)) {
      handleRemoveFromWishlist(item._id).then(() => refetch());
    } else {
      addToWishlist(item._id).then(() => refetch());
    }
  }

  return (
    <div key={item._id} className="shadow-sm relative">
      <div>
        {wishlist && (
          <p className="absolute right-4 top-4 bg-white rounded-full">
            <GiCancel onClick={() => handleRemoveFromWishlist(item._id)} />
          </p>
        )}
      </div>
      <Link to={`/products/${item._id}/${item.title}`}>
        <img
          src={item.images[0]}
          className={`w-full h-[316px] ${
            !wishlist ? "hover:scale-105" : ""
          } transition-all duration-300`}
        />
      </Link>
      {!wishlist && (
        <span className="absolute right-4 top-4 border rounded-full p-2 bg-white text-xl text-gray-600">
          {wishlistProductId.includes(item._id) ? (
            <FaHeart onClick={toggleWishlist} />
          ) : (
            <FaRegHeart onClick={toggleWishlist} />
          )}
        </span>
      )}
      <div className="mt-2">
        <h4 className="text-base font-semibold text-[#3A3845]">{item.title}</h4>

        <div className="flex gap-4 mb-2">
          {item.discountedPrice && (
            <p className="text-black/50 flex items-center line-through">
              <LiaRupeeSignSolid />
              {item.price}
            </p>
          )}
          <p className="font-semibold flex items-center">
            <LiaRupeeSignSolid />
            {item.discountedPrice ? item.discountedPrice : item.price}
          </p>
        </div>
        <p className="text-[#807F86] truncate w-full">{item.description}</p>

        <p className="mb-2">⭐⭐⭐⭐⭐</p>
      </div>
      <div>
        <button
          onClick={() => handleAddToCart()}
          className="text-center w-full py-1 bg-[#EC355B] text-[#FFFFFF] my-2 font-medium text-base cursor-pointer h-10"
        >
          {cartProducts ? (
            <Link to={"/cart"}>
              <p className="flex items-center justify-center gap-2">
                Go to cart
                <span>
                  <FaArrowRight />
                </span>
              </p>
            </Link>
          ) : (
            <p>Add to cart</p>
          )}
        </button>
      </div>
    </div>
  );
}

export default Cards;
