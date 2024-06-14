import { Link } from "react-router-dom";

function Banner() {
  return (
    <div className="flex px-20">
      <img
        src="/images/Banner/tshirt yarn 3.svg"
        alt="capri bag"
        className="relative z-50 h-[550px] w-[392px] rounded-full"
      />
      <img
        src="/images/Banner/tshirt yarn 2.svg"
        alt="flower earing"
        className="absolute left-[375px] z-40 h-[550px] w-[392px] rounded-full hidden sm:block"
      />
      <img
        src="/images/Banner/tshirt yarn 1.svg"
        alt="sling bag"
        className="absolute left-[725px] z-30 h-[550px] w-[392px] rounded-full hidden lg:block"
      />
      <img
        src="/images/Banner/Ellipse 1177 .svg"
        alt="round"
        className="absolute left-[270px] sm:left-[600px] lg:left-[1000px] top-[210px] z-20 h-[390px] w-[350px] rounded-full"
      />
      <Link to={"/products"}>
        <p className="absolute duration-500 sm:left-[760px] left-[470px] lg:left-[1130px] top-[355px] sm:top-[380px] lg:top-[380px] z-50 text-[30px] sm:text-[28px] lg:text-[32px] text-center font-primary font-[650]">
          BEST SELLER
        </p>
      </Link>
    </div>
  );
}

export default Banner;
