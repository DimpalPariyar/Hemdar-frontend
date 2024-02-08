import { useFormik } from "formik";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useAddProductMutation } from "../../apiSlice/addProductApiSlice";

function AddProducts() {
  const [addProduct, { data: newProduct, error, isLoading }] =
    useAddProductMutation();
  console.log(newProduct, error, isLoading);

  const addNewProduct = (data) => {
    console.log(values);
    addProduct(data);
  };

  /*eslint-disable no-unused-vars*/

  const { values, handleChange, isSubmitting, errors, touched, handleSubmit } =
    useFormik({
      initialValues: {
        title: "",
        description: "",
        material: "",
        category: "",
        // status: "",
        stock: "",
        // size: "",
        // color: "",
        price: "",
        // brand: "hemdar",
        discountedPrice: "",
        // shippingCharges: "",
        // isActive: true,
      },
      // validationSchema: basicScheme,
      onSubmit: addNewProduct,
    });

  return (
    <div className="m-20">
      <div className="grid grid-flow-col gap-1 justify-start items-center">
        <div className="row-span-2">
          <Link to={"/products"}>
            <IoIosArrowRoundBack className="rounded-md border-2 size-10 p-2 mx-2" />
          </Link>
        </div>

        <p className="text-sm">Back to product list</p>
        <h1 className="font-bold text-xl">Add New Product</h1>
      </div>

      <div className="mx-2 my-8">
        <form autoComplete="off">
          <div className="border p-4 rounded-md grid gap-4 grid-cols-2">
            <div className="border p-4 rounded-md">
              <label htmlFor="title" className=" text-gray-600">
                Product Name
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.title}
                id="title"
                onChange={handleChange}
                type="text"
              />

              <label htmlFor="description" className="text-gray-600">
                Product Description
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.description}
                id="description"
                onChange={handleChange}
                type="text"
              />

              <label htmlFor="material" className="text-gray-600">
                Material
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.material}
                id="material"
                onChange={handleChange}
                type="text"
              />
            </div>

            <div className="border p-4 rounded-md">
              <label htmlFor="category" className=" text-gray-600">
                Category
              </label>
              <select
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.category}
                id="category"
                onChange={handleChange}
              >
                <option></option>
                <option>Bags</option>
                <option>Earings</option>
                <option>Keychains</option>
              </select>

              {/* <label htmlFor="status" className="text-gray-600">
                Status
              </label>
              <select
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.status}
                id="status"
                onChange={handleChange}
              >
                <option></option>
                <option>New arrivals</option>
              </select> */}

              {/* <label htmlFor="isActive" className=" text-gray-600">
                In stock
              </label>
              <select
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.isActive}
                id="isActive"
                onChange={handleChange}
              >
                <option>true</option>
                <option>false</option>
              </select> */}
            </div>

            <div className="border p-4 rounded-md">
              <label htmlFor="stock" className=" text-gray-600">
                Quantity
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.stock}
                id="stock"
                onChange={handleChange}
                type="number"
              />

              {/* <label htmlFor="size" className="text-gray-600">
                Size
              </label>
              <select
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.size}
                id="size"
                onChange={handleChange}
              >
                <option></option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
                <option>XXL</option>
              </select> */}

              {/* <label htmlFor="color" className="text-gray-600">
                Color
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.color}
                id="color"
                onChange={handleChange}
                type="text"
              /> */}
            </div>

            <div className="border p-4 rounded-md">
              <label htmlFor="price" className=" text-gray-600">
                Price
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.price}
                id="price"
                onChange={handleChange}
                type="number"
              />

              <label htmlFor="discountedPrice" className="text-gray-600">
                Discounted price
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.discountedPrice}
                id="discountedPrice"
                onChange={handleChange}
                type="number"
              />
            </div>

            {/* <div className="border p-4 rounded-md">
              <label htmlFor="shippingCharges" className=" text-gray-600">
                Shipping Charges
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.shippingCharges}
                id="shippingCharges"
                onChange={handleChange}
                type="number"
              />
            </div> */}

            <div className="border p-4 rounded-md">
              <label htmlFor="image" className=" text-gray-600">
                Upload Images
              </label>
              {/* <Field
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setFieldValue("image", file);
                }}
              /> */}
            </div>

            <div className="flex gap-10 ">
              <button
                disabled={isSubmitting}
                type="submit"
                onClick={handleChange}
                className={`rounded-md text-center py-1 h-10 mt-8 w-full bg-white text-black border-2 my-2 text-xl ${
                  isSubmitting ? "opacity-30" : ""
                }`}
              >
                Delete Product
              </button>

              <button
                disabled={isSubmitting}
                type="submit"
                onClick={handleSubmit}
                className={`rounded-md text-center py-1 h-10 mt-8 w-full bg-blue-500 text-white my-2 text-xl ${
                  isSubmitting ? "opacity-30" : ""
                }`}
              >
                Add Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProducts;

// {
//   "id": 2,
//   "title": "Yellow earing",
//   "description": "Handmade red bag with golden chain",
//   "category": "Earing",
//   "price": 130.0,
//   "discountedPrice": 100.00,
//   "Quantity": 2,
//   "size": l
//   "color": yellow,
//   "image": "../src/images/earing.png",
//   "status": "new arrivals"
// },
