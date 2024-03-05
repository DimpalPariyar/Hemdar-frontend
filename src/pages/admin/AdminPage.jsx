import { useNavigate } from "react-router-dom";

import { IoIosAddCircleOutline } from "react-icons/io";

function AdminPage() {
  const navigate = useNavigate();

  return (
    <div className="p-20">
      <h1 className="font-bold text-2xl my-5">Admin</h1>

      {/* <Link to={"/addProducts"}> */}
      <button
        onClick={() => navigate("/addProducts")}
        className="flex gap-1 mb-4 justify-between items-center bg-gray-500 py-1 px-2 text-white"
      >
        <IoIosAddCircleOutline className=" size-5" />
        Products
      </button>

      <button
        onClick={() => navigate("/productsList")}
        className="flex gap-1 mb-4 justify-between items-center bg-gray-500 py-1 px-2 text-white"
      >
        Products List
      </button>

      <button
        onClick={() => navigate("/userlist")}
        className="flex gap-1 mb-4 justify-between items-center bg-gray-500 py-1 px-2 text-white"
      >
        User List
      </button>
    </div>
  );
}

export default AdminPage;
