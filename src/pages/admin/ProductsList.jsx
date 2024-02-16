import { createColumnHelper } from "@tanstack/react-table";
import { useGetAllProductsQuery } from "../../apiSlice/addProductApiSlice";
// import ReactTable from "../../components/ReactTable";
import ReacttanStackTable from "../../components/ReacttanStackTable";
import { MdOutlineDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

const columnHelper = createColumnHelper();

function ProductsList() {
  const { data: productData, refetch, isSuccess } = useGetAllProductsQuery();
  console.log(productData);

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, []);

  const columns = [
    columnHelper.accessor(({ title }) => title, {
      id: "title",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Title</span>,
    }),
    columnHelper.accessor(({ category }) => category, {
      id: "category",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Category</span>,
    }),
    columnHelper.accessor(({ description }) => description, {
      id: "description",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Description</span>,
    }),

    columnHelper.accessor(({ images }) => images, {
      id: "images",
      header: () => <span>Images</span>,
      cell: ({ row }) => {
        return (
          <>
            <img src={row.original.images[0]} />
          </>
        );
      },
    }),
    columnHelper.accessor(({ material }) => material, {
      id: "material",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Material</span>,
    }),
    columnHelper.accessor(({ price }) => price, {
      id: "price",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Price</span>,
    }),
    columnHelper.accessor(({ discountedPrice }) => discountedPrice, {
      id: "discountedPrice",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Disc Price</span>,
    }),
    columnHelper.accessor(({ length }) => length, {
      id: "length",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Length</span>,
    }),
    columnHelper.accessor(({ breath }) => breath, {
      id: "breath",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Breath</span>,
    }),
    columnHelper.accessor(({ height }) => height, {
      id: "height",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Height</span>,
    }),
    columnHelper.accessor(({ productweight }) => productweight, {
      id: "productweight",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Product Weight</span>,
    }),

    columnHelper.accessor(({ stock }) => stock, {
      id: "stock",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Stock</span>,
    }),
    columnHelper.accessor(({ color }) => color, {
      id: "color",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Color</span>,
    }),
    columnHelper.accessor(({ shippingCharges }) => shippingCharges, {
      id: "shippingCharges",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Shipping Charges</span>,
    }),
    columnHelper.accessor(({ shippingdetails }) => shippingdetails, {
      id: "shippingdetails",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Shipping Details</span>,
    }),
    columnHelper.accessor(({ status }) => status, {
      id: "status",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>Status</span>,
    }),
    columnHelper.accessor(({ isActive }) => isActive, {
      id: "isActive",
      cell: (info) => <i>{info.getValue()}</i>,
      header: () => <span>In Stock</span>,
    }),
    columnHelper.accessor(({ _id }) => _id, {
      id: "_id",
      header: () => <span>Edit</span>,
      cell: ({ row }) => {
        return (
          <>
            <Link to={`/updateProducts/${row.original._id}`}>
              <MdOutlineEdit />
            </Link>
          </>
        );
      },
    }),
    columnHelper.accessor(({ _id }) => _id, {
      id: "_id",
      header: () => <span>Remove</span>,
      cell: ({ row }) => {
        console.log(row);
        return (
          <>
            <MdOutlineDeleteOutline />
          </>
        );
      },
    }),
  ];

  return (
    <div>
      <h1>
        <Link to={"/admin"}>
          <IoIosArrowRoundBack className="rounded-md border-2 size-10 p-2 mx-2" />
        </Link>
      </h1>
      {productData && (
        <ReacttanStackTable columns={columns} data={productData} />
      )}
    </div>
  );
}

export default ProductsList;
