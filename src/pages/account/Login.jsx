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
      const loginError = error?.data?.error;
      alert(loginError);
    }
  }, [error]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (loginUserData) {
      dispatch(loginSuccess(loginUserData));
      sessionStorage.setItem("isLoggedIn", "true");
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
    <div className="py-24 px-24 bg-[#F6D9DF] flex flex-col gap-4 sm:flex-row items-center justify-around font-primary">
      <div>
        <img src="/images/Login/rafiki.svg" alt="login image" />
      </div>
      <div className="py-4 w-[400px] flex flex-col items-center justify-center gap-4">
        <div>
          <h1 className=" text-[25px] font-semibold text-[#000000] text-center">
            LOGIN
          </h1>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* <label htmlFor="email" className=" my-4">
            Email
          </label> */}
          <input
            className={`w-full rounded-lg mt-1 border-[1px] px-4 h-[40px] mb-4 bg-[#FFFFFF] text-lg text-[#828282]`}
            value={values.email}
            onChange={handleChange}
            id="email"
            type="string"
            placeholder="Mobile number or email address *"
            onBlur={handleBlur}
          />

          {/* <label htmlFor="password" className=" my-4">
            Password
          </label> */}
          <input
            className={`w-full rounded-lg mt-1 border-[1px] px-4 h-[40px] mb-4 bg-[#FFFFFF] text-lg text-[#828282]`}
            value={values.password}
            onChange={handleChange}
            id="password"
            type="string"
            placeholder="Password *"
            onBlur={handleBlur}
          />

          <div className="w-full cursor-pointer flex justify-between items-center gap-9">
            <div className="flex items-center gap-2">
              <input
                className="border-0 border-[#B9B5B5] w-5 h-5 "
                type="checkbox"
              />
              <label className="text-lg text-[#959DA3]">Remember me?</label>
            </div>
            <div className="text-lg text-[#000000]">
              <p>Lost your password ?</p>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            onClick={handleSubmit}
            className={`rounded-lg text-center w-full py-1 bg-[#EC355B] text-[#FFFFFF] my-2 font-medium text-base cursor-pointer h-10 ${
              isSubmitting ? "opacity-30" : ""
            }`}
          >
            Login
          </button>
        </form>

        <div className="w-full cursor-pointer flex justify-center gap-2">
          <div className="sm:hidden xl:block w-[80px] py-0 border-[1px] border-[#828282] my-[13.5px]"></div>
          <span className=" text-xl text-[#828282]">Not a member?</span>
          <h1 className="hover:underline hover:text-[#EC355B] text-xl">
            <Link to="/register">Register</Link>
          </h1>
          <div className="sm:hidden xl:block w-[80px] py-0 border-[1px] border-[#828282] my-[13.5px]"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
