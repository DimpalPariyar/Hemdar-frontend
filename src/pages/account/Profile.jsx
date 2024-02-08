import { useState } from "react";
// import { useSelector } from "react-redux";
import axios from "axios";
import { useUserDataQuery } from "../../apiSlice/authApiSlice";

import { IoKeyOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { FaRegHeart, FaRegUser } from "react-icons/fa";

import PersonalInfo from "../../components/PersonalInfo";
import Address from "../../components/Address";
import WishList from "../../components/WishList";
import MyOrders from "../../components/MyOrders";

axios.defaults.withCredentials = true;
function Profile() {
  /*eslint-disable no-unused-vars*/
  const [isActive, setIsActive] = useState("tab1");
  // const selector = useSelector((state) => state.auth);
  const { data } = useUserDataQuery();
  console.log(data);
  // const sendRequest = async () => {
  //   // const res = await axios
  //   //   .get("http://localhost:3004/auth/userdetails", {
  //   //     headers: { Authorization: `Bearer ${selector.accessToken}` },
  //   //   })
  //   //   .catch((err) => console.log(err));
  //   const res = await axios.get("http://localhost:3004/auth/userdetails", {
  //     withCredentials: true,
  //   });
  //   const data = await res.data;
  //   console.log(data);
  // };

  function activeTab(id) {
    setIsActive(id);
  }

  // useEffect(() => {
  //   sendRequest();
  // }, [selector]);

  return (
    <div className=" bg-primaryBG font-primary">
      <div className="mt-4 p-20 flex flex-col">
        <div>
          <h1 className=" font-bold text-2xl pb-4">My account</h1>
        </div>

        <div className=" flex gap-2 my-4 ">
          <div className="flex flex-col items-start pt-2 basis-[30%]">
            <button
              onClick={() => activeTab("tab1")}
              className={`text-start p-2 mx-4 text-nowrap w-full  ${
                isActive === "tab1" ? "bg-blue-100 text-blue-500" : ""
              }`}
            >
              <p className="flex gap-1">
                <span className="p-1">
                  <FaRegUser />
                </span>
                Personal info
              </p>
            </button>

            <button
              className={`text-start p-2 mx-4 text-nowrap w-full  ${
                isActive === "tab2" ? "bg-blue-100 text-blue-500" : ""
              }`}
              onClick={() => activeTab("tab2")}
            >
              <p className="flex gap-1">
                <span className="p-1">
                  <GrLocation />
                </span>
                Address
              </p>
            </button>

            <button
              className={`text-start p-2 mx-4 text-nowrap w-full  ${
                isActive === "tab3" ? "bg-blue-100 text-blue-500" : ""
              }`}
              onClick={() => activeTab("tab3")}
            >
              <p className="flex gap-1">
                <span className="p-1">
                  <FiShoppingCart />
                </span>
                My Orders
              </p>
            </button>

            <button
              className={`text-start p-2 mx-4 text-nowrap w-full  ${
                isActive === "tab4" ? "bg-blue-100 text-blue-500" : ""
              }`}
              onClick={() => activeTab("tab4")}
            >
              <p className="flex gap-1">
                <span className="p-1">
                  <FaRegHeart />
                </span>
                Wishlist
              </p>
            </button>

            <button
              className={`text-start p-2 mx-4 text-nowrap w-full  ${
                isActive === "tab5" ? "bg-blue-100 text-blue-500" : ""
              }`}
              onClick={() => activeTab("tab5")}
            >
              <p className="flex gap-1">
                <span className="p-1">
                  <IoKeyOutline />
                </span>
                Password
              </p>
            </button>
          </div>

          <div className="rounded-md w-full h-full bg-white py-6 px-6 mx-2 ">
            {isActive === "tab1" && <PersonalInfoProfile />}
            {isActive === "tab2" && <AddressProfile />}
            {isActive === "tab3" && <MyOrdersProfile />}
            {isActive === "tab4" && <WishListProfile />}
            {isActive === "tab5" && <Password />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

function PersonalInfoProfile() {
  return (
    <div className="">
      <h1 className="flex gap-1 font-semibold text-lg mb-2">
        <span className="p-1">
          <FaRegUser />
        </span>
        Personal Information
      </h1>

      <hr />

      <div className="px-2 py-4 flex flex-col gap-4 w-fit">
        <PersonalInfo />
        <button className="bg-blue-200 rounded-sm p-1 mx-2">
          Save changes
        </button>
      </div>
    </div>
  );
}

function AddressProfile() {
  return (
    <div className="">
      <h1 className="font-semibold text-lg mb-2 flex gap-1">
        <span className="p-1">
          <GrLocation />
        </span>
        Default Address
      </h1>
      <hr />
      <hr />
      <div className="px-2 py-4 flex flex-col gap-4 w-72">
        <Address />
        <button className="bg-blue-200 rounded-sm p-1 mx-2">
          Save changes
        </button>
      </div>
    </div>
  );
}

function MyOrdersProfile() {
  return (
    <div className="">
      <h1 className="font-semibold text-lg mb-2 flex gap-1">
        <span className="p-1">
          <FiShoppingCart />
        </span>
        Orders
      </h1>
      <hr />
      <MyOrders />
    </div>
  );
}

function WishListProfile() {
  return (
    <div className="">
      <h1 className="font-semibold text-lg mb-2 flex gap-1">
        <span className="p-1">
          <FaRegHeart />
        </span>
        Wishlist
      </h1>
      <hr />
      <WishList />
    </div>
  );
}

function Password() {
  return (
    <div className="">
      <h1 className="font-semibold text-lg mb-2 flex gap-1">
        <span className="p-1">
          <IoKeyOutline />
        </span>
        Change Password
      </h1>
      <hr />
    </div>
  );
}
