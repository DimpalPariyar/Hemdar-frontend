import { Link } from "react-router-dom";

function Fotter() {
  return (
    <div className=" flex flex-col items-center justify-center py-36">
      <div className=" text-3xl mb-6 font-semibold">
        <h1>Join Us</h1>
      </div>
      <div className="my-4">
        <p className="text-center">
          We will let you know when we have new arrivals, events and
          promo&apos;s don&apos;t
          <br /> worry we send them in frequently, just a friendly hi now and
          again!
        </p>
      </div>
      <div className="flex mt-4 mb-12 border-b-2  border-black w-80 justify-between">
        <input
          type="text"
          placeholder="Enter your email"
          className="px-2 w-80 focus:outline-0 "
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
          />
        </svg>
      </div>
      <div className="mt-6 mb-4 flex gap-4">
        <svg
          className="h-12 w-12 cursor-pointer rounded-full border-black border-2 p-2 "
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />{" "}
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />{" "}
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>

        <svg
          className="h-12 w-12 cursor-pointer  rounded-full border-black border-2 p-2 "
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
        </svg>
      </div>

      <div className="mt-4 mb-8 ">
        <ul className="flex gap-5 ">
          <Link to={"/aboutus"}>
            <li>About Us</li>
          </Link>
          <Link to={"/contactus"}>
            <li>Contact</li>
          </Link>
          <li>FAQ</li>
          <Link to={"/shippingpolicy"}>
            <li>Shipping Policy</li>
          </Link>
          <Link to={"/termsandconditions"}>
            <li>Terms and Conditions</li>
          </Link>
        </ul>
      </div>
      <div>
        <p className="text-sm">@2016 Hemdar Collection</p>
      </div>
    </div>
  );
}

export default Fotter;
