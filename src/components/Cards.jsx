import { Link } from "react-router-dom";
import { HiOutlineHeart } from "react-icons/hi";

function Cards({ item }) {
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
          <span className="text-xl text-gray-600">
            <HiOutlineHeart />
          </span>
        </div>
        <div className="flex justify-between">
          <p className="text-black/50">{item.category}</p>
          <p className="font-semibold">Rs.{item.price}</p>
        </div>
      </div>
    </div>
  );
}

export default Cards;
