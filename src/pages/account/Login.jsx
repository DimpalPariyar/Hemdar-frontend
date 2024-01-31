import { useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../apiSlice/authApiSlice";
import { loginSuccess } from "../../reduxStoreSlice/authSlice";
import { Link, useNavigate } from "react-router-dom";

/*
pariyardimple01@gmail.com
Dimple@123
*/

function Login() {
  const [login, { data: loginUserData, isSuccess, error, isLoading }] =
    useLoginMutation();
  console.log(isLoading, loginUserData);

  const navigate = useNavigate();

  const createLogin = (data) => {
    login(data);
  };

  useEffect(() => {
    if (error) {
      const loginError = error.data.error;
      alert(loginError);
    }
  }, [error]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (loginUserData) {
      dispatch(loginSuccess(loginUserData));
    }
  }, [loginUserData]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/account");
    }
  }, [isSuccess]);

  const { values, handleChange, handleBlur, isSubmitting, handleSubmit } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },

      onSubmit: createLogin,
    });

  return (
    <div className="px-10 py-20 flex items-center justify-center">
      <div className="p-4 w-80 flex flex-col items-center justify-center">
        <div>
          <h1 className=" text-5xl font-bold mb-6 text-center">Login</h1>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="email" className=" my-4">
            Email
          </label>
          <input
            className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
            value={values.email}
            onChange={handleChange}
            id="email"
            type="string"
            placeholder="Enter your Email"
            onBlur={handleBlur}
          />

          <label htmlFor="password" className=" my-4">
            Password
          </label>
          <input
            className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
            value={values.password}
            onChange={handleChange}
            id="password"
            type="string"
            placeholder="Enter your Password"
            onBlur={handleBlur}
          />

          <div className="mt-1 mb-4 w-full text-sm text-right cursor-pointer flex justify-between items-center gap-9">
            <div className="flex gap-1">
              <input className="" type="checkbox" />
              <label className="font-medium">Remember me?</label>
            </div>
            <div>
              <p>Forgot password?</p>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            onClick={handleSubmit}
            className="rounded-md text-center w-full py-1 text-white my-2 text-2xl cursor-pointer bg-black h-10 "
          >
            Log In
          </button>
        </form>

        <div className="w-full my-5 text-left cursor-pointer hover:underline hover:text-blue-900">
          <h1>
            <Link to="/register">Create Account</Link>
            {/* <a href="/register">Create Account</a> */}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Login;
