function CreateAccount() {
  return (
    <div className=" px-10 py-36 flex items-center justify-center">
      <div className="p-4 w-96 flex flex-col items-center justify-center">
        <div>
          <h1 className=" text-4xl font-bold mb-6 text-center">
            Create Account
          </h1>
        </div>
        <div className="w-full">
          <p className=" my-4">First Name</p>
          <input
            type="text"
            className="w-full border-black border-b-2 px-2 focus:outline-0"
          />
          <p className=" my-4">Last Name</p>
          <input
            type="text"
            className="w-full border-black border-b-2 px-2 focus:outline-0"
          />
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

        <div className="h-10 mt-8 w-full bg-black cursor-pointer text-white my-2 text-2xl">
          <button className="text-center w-full py-1 ">Create</button>
        </div>

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
