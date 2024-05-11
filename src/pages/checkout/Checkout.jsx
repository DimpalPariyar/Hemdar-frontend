import { useEffect } from "react";
import {
  useSingleUserQuery,
  useUpdateUserMutation,
} from "../../apiSlice/authApiSlice";
import BillingDetails from "./BillingDetails";
import Payment from "./Payment";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
// import { useState } from "react";

function Checkout() {
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

      onSubmit: createPlaceOrder,
    });
  const { data: singleUserData, isSuccess } = useSingleUserQuery();
  console.log(singleUserData);

  const [updateUser, { data: updateUserData }] = useUpdateUserMutation();
  console.log(updateUser, updateUserData);

  const navigate = useNavigate();

  function createPlaceOrder(data) {
    updateUser(data);
    navigate("/payment-successful");
  }

  useEffect(() => {
    if (singleUserData) {
      setValues({
        username: singleUserData.username || "",
        mobile: singleUserData.mobile || "",
        email: singleUserData.email || "",
        country: singleUserData?.address?.country || "",
        streetaddress: singleUserData?.address?.streetaddress || "",
        apartment: singleUserData?.address?.apartment || "",
        city: singleUserData?.address?.city || "",
        state: singleUserData?.address?.state || "",
        pincode: singleUserData?.address?.pincode || "",
      });
    }
  }, [isSuccess]);

  // console.log(values);

  return (
    <form onSubmit={handleSubmit}>
      <div className=" my-24 flex flex-col mx-10 lg:flex-row">
        <div className=" basis-[55%]">
          <BillingDetails
            values={values}
            handleChange={handleChange}
            singleUserData={singleUserData}
          />
        </div>

        <div className=" basis-[45%] bg-primaryBG">
          <Payment handleSubmit={handleSubmit} />
        </div>
      </div>
    </form>
  );
}

export default Checkout;
