import { useFormik } from "formik";
import { basicScheme } from "./basicSchemas";
import { useSignupMutation } from "../../apiSlice/authApiSlice";
import { useNavigate } from "react-router-dom";
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
    <div className=" px-10 py-20 flex items-center justify-center">
      <div className="p-4 w-96 flex flex-col items-center justify-center">
        <div>
          <h1 className=" text-4xl font-bold mb-6 text-center">
            Create Account
          </h1>
        </div>
        <div className=" w-full"></div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="username" className=" my-4">
            Username
          </label>
          <input
            className={` w-full rounded-lg mt-1 py-1 border-2 px-2 ${
              errors.username && touched.username ? "border-red-500" : "mb-4"
            } `}
            value={values.username}
            onChange={handleChange}
            id="username"
            type="string"
            placeholder="Enter your Username"
            onBlur={handleBlur}
          />
          {errors.username && touched.username && (
            <p className="text-red-600 text-sm mb-4">{errors.username}</p>
          )}

          <label htmlFor="email" className=" my-4">
            Email
          </label>
          <input
            className={` w-full rounded-lg mt-1 py-1 border-2 px-2 ${
              errors.email && touched.email ? "border-red-500" : "mb-4"
            } `}
            value={values.email}
            onChange={handleChange}
            id="email"
            type="email"
            placeholder="Enter your Email"
            onBlur={handleBlur}
          />
          {errors.email && touched.email && (
            <p className="text-red-600 text-sm mb-4">{errors.email}</p>
          )}

          <label htmlFor="mobile" className=" my-4">
            Mobile Number
          </label>
          <input
            className={` w-full rounded-lg mt-1 py-1 border-2 px-2 ${
              errors.mobile && touched.mobile ? "border-red-500" : "mb-4"
            } `}
            value={values.mobile}
            onChange={handleChange}
            id="mobile"
            type="number"
            placeholder="Enter your Mobile Number"
            onBlur={handleBlur}
          />
          {errors.mobile && touched.mobile && (
            <p className="text-red-600 text-sm mb-4">{errors.mobile}</p>
          )}

          <label htmlFor="password" className=" my-4">
            Password{" "}
          </label>
          <input
            className={` w-full rounded-lg mt-1 py-1 border-2 px-2 ${
              errors.password && touched.password ? "border-red-500" : "mb-4"
            } `}
            value={values.password}
            onChange={handleChange}
            id="password"
            type="password"
            placeholder="Enter your password"
            onBlur={handleBlur}
          />
          {errors.password && touched.password && (
            <p className="text-red-600 text-sm mb-4">{errors.password}</p>
          )}

          <label htmlFor="confirmPassword" className=" my-4">
            Confirm Password
          </label>
          <input
            className={` w-full rounded-lg mt-1 py-1 border-2 px-2 ${
              errors.confirmPassword && touched.confirmPassword
                ? "border-red-500"
                : "mb-4"
            } `}
            value={values.confirmPassword}
            onChange={handleChange}
            id="confirmPassword"
            type="string"
            placeholder="Confirm Password"
            onBlur={handleBlur}
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <p className="text-red-600 text-sm mb-4">
              {errors.confirmPassword}
            </p>
          )}

          <button
            disabled={isSubmitting}
            type="submit"
            onClick={handleSubmit}
            className={`rounded-sm text-center py-1 h-10 mt-8 w-full bg-black cursor-pointer text-white my-2 text-2xl ${
              isSubmitting ? "opacity-30" : ""
            }`}
          >
            Create
          </button>
        </form>

        <div className="w-full text-left cursor-pointer flex gap-4 justify-center">
          <p>already a member?</p>
          <p className="hover:underline hover:text-blue-900">
            <a href="/login">login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
