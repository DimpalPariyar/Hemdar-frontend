import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";

import { GiCancel } from "react-icons/gi";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
} from "../apiSlice/addToWishlistApiSlice";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useAddToCartMutation } from "../apiSlice/addToCartApiSlice";

function Cards({ item, wishlist, refetchWishlist }) {
  const [wishlistProductId, setWishlistProductId] = useState([]);

  const [addToWishlist] = useAddToWishlistMutation();
  const [addToCart] = useAddToCartMutation();
  const { data: wishlistedProducts, refetch } = useGetWishlistQuery();

  useEffect(() => {
    if (wishlistedProducts) {
      setWishlistProductId(() => {
        const productid = wishlistedProducts.items.map((id) => id._id);
        return [...productid];
      });
    }
  }, [wishlistedProducts, refetch]);

  console.log(wishlistProductId);

  function handleAddToCart() {
    const newItem = {
      productId: item._id,
      quantity: 1,
      size: "",
      sizequantity: 1,
      color: item.color,
    };
    addToCart(newItem);
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
    <div key={item._id} className="shadow-sm p-2 relative">
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
          className={` mx-auto aspect-[12/13] size-full ${
            !wishlist ? "hover:scale-105" : ""
          } transition-all duration-300`}
        />
      </Link>
      <div className="mt-4 px-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold mb-2">{item.title}</h4>
          {!wishlist && (
            <span className="text-xl text-gray-600">
              {wishlistProductId.includes(item._id) ? (
                <FaHeart onClick={toggleWishlist} />
              ) : (
                <FaRegHeart onClick={toggleWishlist} />
              )}
            </span>
          )}
        </div>
        <div className="flex gap-4">
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
      </div>
      <div>
        {wishlist && (
          <button
            onClick={() => handleAddToCart()}
            className="w-full p-1 border-2 rounded-md border-black my-4 font-semibold"
          >
            Add to cart
          </button>
        )}
      </div>
    </div>
  );
}

export default Cards;
