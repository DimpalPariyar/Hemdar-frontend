import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "../../apiSlice/addProductApiSlice";
import { useEffect, useState } from "react";

function UpdateProduct() {
  const { _id } = useParams();

  const {
    data: singleProduct,
    isSuccess,
    refetch,
  } = useGetSingleProductQuery(_id);
  const [updateProduct, { isSuccess: updateSuccess }] =
    useUpdateProductMutation();

  const [image, setImage] = useState([]);

  const navigate = useNavigate();

  const editProduct = (data) => {
    const payload = {
      ...data,
      images: image,
    };

    updateProduct(payload);
  };

  useEffect(() => {
    if (updateSuccess) {
      navigate("/productsList");
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setImage(singleProduct.images);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  console.log(singleProduct);

  return (
    <div className="m-20">
      <div className="grid grid-flow-col gap-1 justify-start items-center">
        <div className="row-span-2">
          <Link to={"/productsList"}>
            <IoIosArrowRoundBack className="rounded-md border-2 size-10 p-2 mx-2" />
          </Link>
        </div>

        <p className="text-sm">Back to product list</p>
        <h1 className="font-bold text-xl">Update Product</h1>
      </div>
      {singleProduct && (
        <ProductForm
          image={image}
          setImage={setImage}
          defaultValue={singleProduct}
          onSubmit={editProduct}
        />
      )}
    </div>
  );
}

export default UpdateProduct;
