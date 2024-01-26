function Login() {
  return (
    <div className="px-10 py-36 flex items-center justify-center">
      <div className="p-4 w-80 flex flex-col items-center justify-center">
        <div>
          <h1 className=" text-5xl font-bold mb-6 text-center">Login</h1>
        </div>
        <div className="w-full">
          <p className=" my-4">Email</p>
          <input
            type="text"
            className="w-full border-black border-b-2 px-2 focus:outline-0"
          />

          <p className="my-4">Password</p>
          <input
            type="text"
            className="w-full border-black border-b-2  px-2 focus:outline-0"
          />
        </div>

        <div className="mt-1 mb-4 w-full text-sm text-right cursor-pointer flex justify-between items-center gap-9">
          <div className="flex gap-1">
            <input className="" type="checkbox" />
            <label className="font-medium">Remember me?</label>
          </div>
          <div>
            <p>Forgot password?</p>
          </div>
        </div>

        <div className="h-10 w-full bg-black cursor-pointer text-white my-2 text-2xl">
          <button className="text-center w-full py-1 ">Log In</button>
        </div>

        <div className="w-full my-5 text-left cursor-pointer hover:underline hover:text-blue-900">
          <h1>
            <a href="/register">Create Account</a>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Login;
