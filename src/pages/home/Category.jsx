import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    title: "hand bag",
    category: "Bag",
    price: 63.85,
    image: "../src/images/Hand_Bag.png",
    status: "new arrivals",
  },
  {
    id: 2,
    title: "Yellow earing",
    category: "Earing",
    price: 130.0,
    image: "../src/images/earing.png",
    status: "new arrivals",
  },

  {
    id: 3,
    title: "multi color sling",
    category: "Bag",
    price: 63.85,
    image: "../src/images/Sling_bag.png",
    status: "New Arriaval",
  },
  {
    id: 4,
    title: "white earing",
    category: "Earing",
    price: 236.0,
    image: "../src/images/white_earing.png",
    status: "New Arriaval",
  },
  // {
  //   id: 5,
  //   title: "white earing",
  //   category: "Earing",
  //   price: 236.0,
  //   image: "../src/images/white_earing.png",
  //   status: "New Arriaval",
  // },
];

function Category() {
  return (
    <div className="max-w-screen-2xl mx-auto container xl:px-28 px-4 py-28">
      {/* <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
        <p className=" md:-rotate-90 font-semibold uppercase text-center bg-black text-white md:p-1.5 p-2 rounded-sm inline-flex">
          EXPLORE NEW AND POPULAR STYLES
        </p>
        <div className="w-1/2 h-full aspect-auto">
          <Link to={"/"}>
            <img
              src="../../src/images/earing.png"
              className="w-full h-[100%] hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>
        <div className="md:w-1/2">
          <div className=" grid grid-cols-2 gap-2 relative">
            {products.map((item) => (
              <Link to={"/products"} key={item.id}>
                <img
                  src={item.image}
                  key={item.id}
                  className="w-full h-full hover:scale-105 hover:opacity-[35%] transition-all duration-200"
                />
                <div className=" absolute font-semibold uppercase text-center bg-black text-white rounded-sm">
                  <p>{item.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div> */}
      <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
        <p className=" md:-rotate-90 font-semibold uppercase text-center bg-black text-white md:p-1.5 p-2 rounded-sm inline-flex">
          EXPLORE NEW AND POPULAR STYLES
        </p>
        <div className="w-1/2 h-full aspect-auto">
          <Link to={"/"}>
            <img
              src="../../src/images/earing.png"
              className="w-full h-[100%] hover:scale-105  transition-all duration-200"
            />
          </Link>
        </div>
        <div className="md:w-1/2">
          <div className=" grid grid-cols-2 gap-2 relative">
            {products.map((item) => (
              <Link to={"/products"} key={item.id}>
                <img
                  src={item.image}
                  key={item.id}
                  className="w-full h-full hover:scale-105 hover:opacity-[35%] transition-all duration-200"
                />
                {/* <div className=" absolute font-semibold uppercase text-center bg-black text-white rounded-sm">
                  <p>{item.category}</p>
                </div> */}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category;

{
  /* <Link to={"/"}>
              <img
                src="../../src/images/Sling_bag.png"
                className="w-full h-full hover:scale-105 hover:opacity-[35%] transition-all duration-200"
              />
            </Link>
            <Link to={"/"}>
              <img
                src="../../src/images/white_earing.png"
                className="w-full h-full hover:scale-105 transition-all duration-200"
              />
            </Link>
            <Link to={"/"}>
              <img
                src="../../src/images/multi-bag-1.png"
                className="w-full h-full hover:scale-105 transition-all duration-200"
              />
            </Link>
            <Link to={"/"}>
              <img
                src="../../src/images/Hand_bag.png"
                className="w-full h-full hover:scale-105 transition-all duration-200"
              />
            </Link> */
}
