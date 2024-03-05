import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";

function Cards({ item }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div key={item._id} className="shadow-sm p-2">
      <Link to={`/products/${item._id}/${item.title}`}>
        <img
          src={item.images[0]}
          className=" mx-auto aspect-[12/13] size-full hover:scale-105 transition-all duration-300 "
        />
      </Link>
      <div className="mt-4 px-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold mb-2">{item.title}</h4>
          <span
            className="text-xl text-gray-600"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered || isLiked ? (
              <FaHeart onClick={toggleLike} />
            ) : (
              <FaRegHeart onClick={toggleLike} />
            )}
          </span>
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
    </div>
  );
}

export default Cards;
