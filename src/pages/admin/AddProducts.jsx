// import { useFormik } from "formik";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useAddProductMutation } from "../../apiSlice/addProductApiSlice";
import ProductForm from "../../components/ProductForm";
import { useState } from "react";

function AddProducts() {
  const [addProduct, { data: newProduct, error, isLoading }] =
    useAddProductMutation();
  console.log(newProduct, error, isLoading);

  const [image, setImage] = useState([]);

  const addNewProduct = (data) => {
    const payload = {
      ...data,
      images: image,
    };
    console.log(payload);
    addProduct(payload);
    // resetForm();
  };

  return (
    <div className="m-20">
      <div className="grid grid-flow-col gap-1 justify-start items-center">
        <div className="row-span-2">
          <Link to={"/admin"}>
            <IoIosArrowRoundBack className="rounded-md border-2 size-10 p-2 mx-2" />
          </Link>
        </div>

        <p className="text-sm">Back to product list</p>
        <h1 className="font-bold text-xl">Add New Product</h1>
      </div>
      <ProductForm onSubmit={addNewProduct} image={image} setImage={setImage} />
    </div>
  );
}

export default AddProducts;
