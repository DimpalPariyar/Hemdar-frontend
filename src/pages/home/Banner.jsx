import { FaShoppingBag } from "react-icons/fa";

function Banner() {
  return (
    <div className="bg-primaryBG py-20 xl:px-28 px-4">
      <div className="py-28 flex flex-col md:flex-row-reverse justify-between items-center gap-14">
        <div className="md:w-1/2">
          <img src="../src/images/multi-bag-1.png" />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-5xl font-light mb-5">Collection</h1>
          <p className="text-xl mb-7">
            You can explore and shop many different collection of handmade bags,
            earings, keychains
          </p>
          <button className=" bg-black hover:bg-orange-500 px-6 py-2 text-white font-semibold rounded-sm flex items-center gap-2">
            <FaShoppingBag className="inline-flex" /> Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
