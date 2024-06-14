import { useState } from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    title: "hand bag",
    category: "BAGS",
    description: "Description of product",
    price: 2500,
    image: "images/IMG_3292.jpg",
    status: "Featured",
  },
  {
    id: 2,
    title: "Lilac bag",
    category: "BAGS",
    description: "Description of product",
    price: 1300.0,
    image: "images/IMG_bag_lilac.jpg",

    status: "Featured",
  },

  {
    id: 3,
    title: "Sling Bag",
    category: "BAGS",
    description: "Description of product",
    price: 1500,
    image: "images/IMG_3330.jpg",
    status: "Featured",
  },
];

function Display() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="grid sm:grid-cols-2 gap-8 py-24 px-20">
      {products.map((item, index) => (
        <div
          key={item.id}
          className={`${
            index === 0 ? "row-span-2" : ""
          } relative flex flex-col gap-2`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <img
            src={item.image}
            alt={item.title}
            className={`rounded-lg ${
              index === 0 ? "h-[520px] w-[750px]" : "h-[244px] w-[592.7px]"
            } ${
              hoveredIndex === index
                ? " brightness-50 scale-[1.05] duration-500"
                : ""
            }`}
          />
          {hoveredIndex === index && (
            <Link to={"/products"}>
              <button
                className={`bg-[#000000] text-white rounded-2xl px-5 py-3 absolute  ${
                  index === 0
                    ? "left-[250px] top-[230px]"
                    : "left-[220px] top-[100px]"
                }`}
              >
                Shop Now
              </button>
            </Link>
          )}

          {/* <p className=" font-inter font-medium text-lg w-full">{item.title}</p>
          <p className="font-inter font-medium text-lg  text-[#828282] w-full">
            {item.description}
          </p>
          <p className="flex items-center font-inter font-medium text-lg w-full">
            <span>
              <LiaRupeeSignSolid />
            </span>
            {item.price}
          </p> */}
        </div>
      ))}
    </div>
  );
}

export default Display;
