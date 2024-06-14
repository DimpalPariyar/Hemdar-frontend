import { Link } from "react-router-dom";
import { PiWhatsappLogo } from "react-icons/pi";
import { HiMail } from "react-icons/hi";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

function Fotter() {
  return (
    <div className="px-20">
      <hr />
      <div className="pt-16 flex flex-col sm:flex-row font-primary justify-between gap-20">
        <div className="flex flex-col gap-8">
          <h1 className=" text-2xl">HEMDAR COLLECTION</h1>
          <div className="flex text-gray-500 gap-5 text-2xl">
            <Link to={"tel:+9867688624"}>
              <PiWhatsappLogo />
            </Link>
            <Link to={"/"}>
              <FaInstagram />
            </Link>
            <Link to={"/"}>
              <HiMail />
            </Link>
            <Link to={"/"}>
              <FaFacebook />
            </Link>
            <Link to={"/"}>
              <FaYoutube />
            </Link>
          </div>
        </div>
        <div className="flex gap-16">
          <div className="flex flex-col gap-6 pr-10 sm:pr-8 lg:pr-20">
            <h2 className=" font-semibold">COMPANY</h2>
            <div className="flex flex-col gap-6 font-medium text-[#454545]">
              <Link to={"/Aboutus"}>
                <p>About US</p>
              </Link>
              <Link to={"/contactus"}>
                <p>Contact US</p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className=" font-semibold">HELP</h2>
            <div className="flex flex-col gap-6 font-medium text-[#454545]">
              <Link to={"/"}>
                <p>FAQ’s</p>
              </Link>
              <Link to={"/shippingpolicy"}>
                <p>Shipping Policy</p>
              </Link>
              <Link to={"/termsandconditions"}>
                <p>Terms & Conditions</p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className=" font-semibold">STORE</h2>
            <div className="flex flex-col gap-6 font-medium text-[#454545]">
              <Link to={"/products"}>
                <p>Accessories</p>
              </Link>
              <Link to={"/products"}>
                <p>Bags</p>
              </Link>
              <Link to={"/products"}>
                <p>Home Decor</p>
              </Link>
              <Link to={"/products"}>
                <p>Outfits</p>
              </Link>
              <Link to={"/products"}>
                <p>Keychains</p>
              </Link>
              <Link to={"/products"}>
                <p>Customized orders</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center pb-24">
        <p className=" font-primary font-medium text-[#454545] text-lg">
          @2016 Hemdar Collection
        </p>
        <p className="font-semibold font-primary text-[#454545]">
          Made in India🩷
        </p>
      </div>
    </div>
  );
}

export default Fotter;
