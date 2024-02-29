import { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import {
  useSingleUserQuery,
  useUpdateUserMutation,
} from "../../apiSlice/authApiSlice";

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
  const InitialValues = {
    username: "",
    mobile: "",
    email: "",
    country: "",
    streetaddress: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
  };

  /*eslint-disable no-unused-vars*/
  const { values, handleChange, isSubmitting, handleSubmit, setValues } =
    useFormik({
      initialValues: InitialValues,

      onSubmit: updateData,
    });
  const { data: singleUserData, isSuccess } = useSingleUserQuery();
  console.log(singleUserData);

  const [updateUser, { data: updateUserData }] = useUpdateUserMutation();
  console.log(updateUser, updateUserData);

  function updateData(data) {
    updateUser(data);
  }

  useEffect(() => {
    if (singleUserData) {
      setValues({
        username: singleUserData.username || "",
        mobile: singleUserData.mobile || "",
        email: singleUserData.email || "",
        country: singleUserData.address.country || "",
        streetaddress: singleUserData.address.streetaddress || "",
        apartment: singleUserData.address.apartment || "",
        city: singleUserData.address.city || "",
        state: singleUserData.address.state || "",
        pincode: singleUserData.address.pincode || "",
      });
    }
  }, [isSuccess]);

  /*eslint-disable no-unused-vars*/
  const [isActive, setIsActive] = useState("tab1");

  function activeTab(id) {
    setIsActive(id);
  }

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
            {isActive === "tab1" && (
              <PersonalInfoProfile
                handleSubmit={handleSubmit}
                values={values}
                handleChange={handleChange}
              />
            )}
            {isActive === "tab2" && (
              <AddressProfile
                values={values}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
              />
            )}
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

function PersonalInfoProfile({ values, handleChange, handleSubmit }) {
  return (
    <div className="">
      <h1 className="flex gap-1 font-semibold text-lg mb-2">
        <span className="p-1">
          <FaRegUser />
        </span>
        Personal Information
      </h1>

      <hr />

      <div className="px-2 py-4 flex flex-col gap-4 w-96">
        <PersonalInfo values={values} handleChange={handleChange} />
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-200 rounded-sm p-1 mx-2"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

function AddressProfile({ values, handleChange, handleSubmit }) {
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
      <div className="px-2 py-4 flex flex-col gap-4 w-96">
        <Address values={values} handleChange={handleChange} />
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-200 rounded-sm p-1 mx-2"
        >
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

      <div>
        <p className="mt-6 mb-2">Enter old password</p>
        <input
          // value={values.password}
          // onChange={handleChange}
          id="password"
          type="text"
          placeholder="Old Password"
          className="focus:outline-0 border-2 py-1 px-2 ml-1 rounded-sm"
        />

        <p className="mt-6 mb-2">Enter new password</p>
        <input
          // value={values.password}
          // onChange={handleChange}
          id="password"
          type="text"
          placeholder="New Password"
          className="focus:outline-0 border-2 py-1 px-2 ml-1 rounded-sm"
        />

        <p className="mt-6 mb-2">Enter confirm password</p>
        <input
          // value={values.password}
          // onChange={handleChange}
          id="password"
          type="text"
          placeholder="Confirm Password"
          className="focus:outline-0 border-2 py-1 px-2 ml-1 rounded-sm mb-5"
        />
      </div>
    </div>
  );
}
