import { useFormik } from "formik";
import { basicScheme } from "./basicSchemas";
import { useSignupMutation } from "../../apiSlice/authApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function CreateAccount() {
  const [signup, { data: createUserData, error, isLoading }] =
    useSignupMutation();
  console.log(isLoading);

  const navigate = useNavigate();

  const createSignup = (data) => {
    signup(data);
  };

  useEffect(() => {
    if (error) {
      const createUserError = error.data.error;
      alert(createUserError);
    }
  }, [error]);

  useEffect(() => {
    if (createUserData) {
      navigate("/login");
    }
  }, [createUserData]);

  const {
    values,
    handleChange,
    isSubmitting,
    errors,
    touched,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      username: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: basicScheme,
    onSubmit: createSignup,
  });

  return (
    <div className="py-24 px-24 bg-[#F6D9DF] flex items-center justify-center font-primary">
      <div className="w-[400px] flex flex-col items-center justify-center gap-3">
        <div>
          <h1 className=" text-[25px] font-semibold text-center">REGISTER</h1>
        </div>
        <div className=" w-full"></div>
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* <label htmlFor="username" className=" my-4">
            Username
          </label> */}
          <input
            className={`w-[400px] rounded-lg mt-1 py-1 border-[1px] px-4 h-[40px] mb-4 bg-[#FFFFFF] text-lg text-[#828282] ${
              errors.username && touched.username
                ? "border-[#EC355B] mb-0"
                : "mb-4"
            } `}
            value={values.username}
            onChange={handleChange}
            id="username"
            type="string"
            placeholder="Username*"
            onBlur={handleBlur}
          />
          {errors.username && touched.username && (
            <p className="text-[#EC355B] text-sm mb-4">{errors.username}</p>
          )}

          {/* <label htmlFor="email" className=" my-4">
            Email
          </label> */}
          <input
            className={`w-[400px] rounded-lg mt-1 py-1 border-[1px] px-4 h-[40px] mb-4 bg-[#FFFFFF] text-lg text-[#828282] ${
              errors.email && touched.email ? "border-[#EC355B] mb-0" : "mb-4"
            } `}
            value={values.email}
            onChange={handleChange}
            id="email"
            type="email"
            placeholder="Email Address*"
            onBlur={handleBlur}
          />
          {errors.email && touched.email && (
            <p className="text-[#EC355B] text-sm mb-4">{errors.email}</p>
          )}

          {/* <label htmlFor="mobile" className=" my-4">
            Mobile Number
          </label> */}
          <input
            className={`w-[400px] rounded-lg mt-1 py-1 border-[1px] px-4 h-[40px] mb-4 bg-[#FFFFFF] text-lg text-[#828282] ${
              errors.mobile && touched.mobile ? "border-[#EC355B] mb-0" : "mb-4"
            } `}
            value={values.mobile}
            onChange={handleChange}
            id="mobile"
            type="number"
            placeholder="Mobile Number*"
            onBlur={handleBlur}
          />
          {errors.mobile && touched.mobile && (
            <p className="text-[#EC355B] text-sm mb-4">{errors.mobile}</p>
          )}

          {/* <label htmlFor="password" className=" my-4">
            Password{" "}
          </label> */}
          <input
            className={`w-[400px] rounded-lg mt-1 py-1 border-[1px] px-4 h-[40px] mb-4 bg-[#FFFFFF] text-lg text-[#828282] ${
              errors.password && touched.password
                ? "border-[#EC355B] mb-0"
                : "mb-4"
            } `}
            value={values.password}
            onChange={handleChange}
            id="password"
            type="password"
            placeholder="Password*"
            onBlur={handleBlur}
          />
          {errors.password && touched.password && (
            <p className="text-[#EC355B] text-sm mb-4">{errors.password}</p>
          )}

          {/* <label htmlFor="confirmPassword" className=" my-4">
            Confirm Password
          </label> */}
          <input
            className={`w-[400px] rounded-lg mt-1 py-1 border-[1px] px-4 h-[40px] mb-4 bg-[#FFFFFF] text-lg text-[#828282] ${
              errors.confirmPassword && touched.confirmPassword
                ? "border-[#EC355B] mb-0"
                : "mb-4"
            } `}
            value={values.confirmPassword}
            onChange={handleChange}
            id="confirmPassword"
            type="string"
            placeholder="Confirm Password*"
            onBlur={handleBlur}
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <p className="text-[#EC355B] text-sm mb-4">
              {errors.confirmPassword}
            </p>
          )}

          <button
            disabled={isSubmitting}
            type="submit"
            onClick={handleSubmit}
            className={`rounded-lg text-center w-full py-1 bg-[#EC355B] text-[#FFFFFF] my-2 font-medium text-base cursor-pointer h-10 ${
              isSubmitting ? "opacity-30" : ""
            }`}
          >
            Register
          </button>
        </form>

        <div className="w-full cursor-pointer flex justify-center gap-2">
          <div className="w-[73.5px] py-0 border-[1px] border-[#828282] my-[13.5px]"></div>
          <span className=" text-xl text-[#828282]">Already a member?</span>
          <h1 className="hover:underline hover:text-[#EC355B] text-xl">
            <Link to="/login">Login</Link>
          </h1>
          <div className="w-[73.5px] py-0 border-[1px] border-[#828282] my-[13.5px]"></div>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
