import { useFormik } from "formik";

// import { Link } from "react-router-dom";
// import { IoIosArrowRoundBack } from "react-icons/io";
// import { useAddProductMutation } from "../apiSlice/addProductApiSlice";

function ProductForm({ onSubmit, image, setImage, defaultValue }) {
  // ../src/images/octopus_earing.png

  console.log(defaultValue);

  const InitialValues = {
    title: "",
    description: "",
    material: "",
    category: "",
    status: "",
    stock: "",
    // sizes: "",
    length: "",
    breath: "",
    height: "",
    productweight: "",
    color: "",
    price: "",
    brand: "hemdar",
    discountedPrice: "",
    shippingCharges: "",
    shippingdetails: "",
    images: "",
    isActive: true,
  };
  /*eslint-disable no-unused-vars*/
  const {
    values,
    handleChange,
    isSubmitting,
    errors,
    touched,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: defaultValue ? defaultValue : InitialValues,
    // validationSchema: basicScheme,
    onSubmit,
  });
  console.log(values);

  const handleAddImage = () => {
    setImage((prev) => {
      return [...prev, values.images];
    });
    setValues({
      ...values,
      images: "",
    });
  };

  return (
    <div className="">
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
                value={values?.category}
                id="category"
                onChange={handleChange}
              >
                <option></option>
                <option>Accessories</option>
                <option>Bags</option>
                <option>Earings</option>
                <option>HomeDecor</option>
                <option>Outfits</option>
                <option>Keychains</option>
                <option>CustomizedOrders</option>
              </select>

              <label htmlFor="status" className="text-gray-600">
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
                <option>Best Seller</option>
                <option>Sale</option>
              </select>

              <label htmlFor="isActive" className=" text-gray-600">
                In stock
              </label>
              <select
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values?.isActive}
                id="isActive"
                onChange={handleChange}
              >
                <option>true</option>
                <option>false</option>
              </select>
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

              <label htmlFor="color" className="text-gray-600">
                Color
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.color}
                id="color"
                onChange={handleChange}
                type="text"
              />
              <label htmlFor="productweight" className="text-gray-600">
                Product Weight
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.productweight}
                id="productweight"
                onChange={handleChange}
                type="text"
              />
            </div>

            <div className="border p-4 rounded-md">
              <h1>Size</h1>
              <label htmlFor="length" className="text-gray-600">
                Length
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.length}
                id="length"
                onChange={handleChange}
                type="text"
              />
              <label htmlFor="breath" className="text-gray-600">
                Breath
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.breath}
                id="breath"
                onChange={handleChange}
                type="text"
              />
              <label htmlFor="height" className="text-gray-600">
                Height
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.height}
                id="height"
                onChange={handleChange}
                type="text"
              />
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

            <div className="border p-4 rounded-md">
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
              <label htmlFor="shippingdetails" className=" text-gray-600">
                Shipping Details
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                value={values.shippingdetails}
                id="shippingdetails"
                onChange={handleChange}
                type="text"
              />
            </div>

            <div className="border p-4 rounded-md">
              <label htmlFor="image" className=" text-gray-600">
                Upload Images
              </label>
              <input
                className={` w-full rounded-lg mt-1 py-1 border-2 px-2 mb-4`}
                type="text"
                id="images"
                name="images"
                value={values.images}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
              <button
                className="px-2 bg-blue-500 p-1 rounded-full text-white text-sm"
                type="button"
                onClick={() => handleAddImage()}
              >
                Add Image
              </button>
              {image.length > 0 && (
                <>
                  {image.map((image) => (
                    <>
                      <p>{image}</p>
                    </>
                  ))}
                </>
              )}
            </div>

            <div className="flex gap-10 ">
              <button
                disabled={isSubmitting}
                type="submit"
                onClick={handleSubmit}
                className={`rounded-md text-center py-1 h-10 mt-8 w-full bg-blue-500 text-white my-2 text-xl ${
                  isSubmitting ? "opacity-30" : ""
                }`}
              >
                {defaultValue ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
