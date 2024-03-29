import { createColumnHelper } from "@tanstack/react-table";
import { useUserDataQuery } from "../../apiSlice/authApiSlice";
import ReacttanStackTable from "../../components/ReacttanStackTable";
import { Link } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

function UserList() {
  const { data: userData } = useUserDataQuery();
  console.log(userData);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor(({ username }) => username, {
      id: "username",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>User Name</span>,
    }),
    columnHelper.accessor(({ email }) => email, {
      id: "email",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Email</span>,
    }),
    columnHelper.accessor(({ mobile }) => mobile, {
      id: "mobile",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Mobile No.</span>,
    }),
  ];
  return (
    <div>
      <h1>
        <Link to={"/admin"}>
          <IoIosArrowRoundBack className="rounded-md border-2 size-10 p-2 mx-2" />
        </Link>
      </h1>

      {userData && <ReacttanStackTable columns={columns} data={userData} />}
    </div>
  );
}

export default UserList;
