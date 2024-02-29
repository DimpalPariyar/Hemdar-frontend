// import { GrLocation } from "react-icons/gr";

function Address({ values, handleChange }) {
  return (
    <div className="">
      <div className="px-2 py-4 flex flex-col gap-4 w-full">
        <input
          value={values.country}
          onChange={handleChange}
          id="country"
          type="text"
          placeholder="Country"
          className="focus:outline-0 border-2 p-2"
        />
        <input
          value={values.streetaddress}
          onChange={handleChange}
          id="streetaddress"
          type="text"
          placeholder="Street address"
          className="focus:outline-0 border-2 p-2"
        />
        <input
          value={values.apartment}
          onChange={handleChange}
          id="apartment"
          type="text"
          placeholder="Apartment, suite, unit, etc."
          className="focus:outline-0 border-2 p-2"
        />
        <input
          value={values.city}
          onChange={handleChange}
          id="city"
          type="text"
          placeholder="Town / City"
          className="focus:outline-0 border-2 p-2"
        />
        <input
          value={values.state}
          onChange={handleChange}
          id="state"
          type="text"
          placeholder="State"
          className="focus:outline-0 border-2 p-2"
        />
        <input
          value={values.pincode}
          onChange={handleChange}
          id="pincode"
          type="number"
          placeholder="PIN Code"
          className="focus:outline-0 border-2 p-2"
        />
      </div>
    </div>
  );
}

export default Address;
