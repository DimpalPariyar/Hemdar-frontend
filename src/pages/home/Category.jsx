// import { useState } from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    title: "hand bag",
    category: "ACCESSORIES",
    price: 63.85,
    image: "images/Hand_Bag.png",
    status: "new arrivals",
  },
  {
    id: 2,
    title: "Yellow earing",
    category: "BAGS",
    price: 130.0,
    image: "images/earing.png",
    status: "new arrivals",
  },

  {
    id: 3,
    title: "multi color sling",
    category: "HOME DECOR ACCESSORIES",
    price: 63.85,
    image: "images/Sling_bag.png",
    status: "New Arriaval",
  },
  {
    id: 4,
    title: "white earing",
    category: "OUTFITS",
    price: 236.0,
    image: "images/Octopus_earing.png",
    status: "New Arriaval",
  },
  {
    id: 5,
    title: "white earing",
    category: "KEYCHAINS",
    price: 236.0,
    image: "images/unicorn_keychain.png",
    status: "New Arriaval",
  },
  {
    id: 6,
    title: "white earing",
    category: "CUSTOMIZED Orders",
    price: 236.0,
    image: "images/IMG_bag_lilac.jpg",
    status: "New Arriaval",
  },
];

function Category() {
  // const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="py-24 px-20">
      <h1 className=" text-[40px] font-semibold font-inter pb-6">Categories</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((item) => (
          <div key={item.id} className={`relative`}>
            <img
              src={item.image}
              className="size-[400px] rounded-lg brightness-50"
            />

            <div className="absolute left-[100px] top-[128px] flex flex-col items-center justify-center gap-5 font-primary w-48">
              <p className="text-white text-[24px] text-center">
                {item.category.toUpperCase()}
              </p>
              <Link to={"/products"}>
                <button className="bg-[#000000] text-white rounded-2xl px-5 py-3">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;

{
  /* <div className="py-24 px-20">
      <h1 className=" text-[40px] font-semibold font-inter pb-6">Categories</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((item, index) => (
          <div
            key={item.id}
            className={`relative`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={item.image}
              className={`size-[400px] rounded-lg ${
                hoveredIndex === index
                  ? " brightness-50 scale-[1.05] duration-500"
                  : ""
              } `}
            />

            {hoveredIndex === index && (
              <div className="absolute left-[100px] top-[128px] flex flex-col items-center justify-center gap-5 font-primary w-48">
                <p className="text-white text-[24px] text-center">
                  {item.category.toUpperCase()}
                </p>
                <Link to={"/products"}>
                  <button className="bg-[#000000] text-white rounded-2xl px-5 py-3">
                    Shop Now
                  </button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div> */
}
