// import { GrLocation } from "react-icons/gr";

function Address() {
  return (
    <div className="">
      <div className="px-2 py-4 flex flex-col gap-4 w-full">
        <input
          type="text"
          placeholder="Country"
          className="focus:outline-0 border-2 p-2"
        />
        <input
          type="text"
          placeholder="Street address"
          className="focus:outline-0 border-2 p-2"
        />
        <input
          type="text"
          placeholder="Apartment, suite, unit, etc."
          className="focus:outline-0 border-2 p-2"
        />
        <input
          type="text"
          placeholder="Town / City"
          className="focus:outline-0 border-2 p-2"
        />
        <input
          type="text"
          placeholder="State"
          className="focus:outline-0 border-2 p-2"
        />
        <input
          type="number"
          placeholder="PIN Code"
          className="focus:outline-0 border-2 p-2"
        />
      </div>
    </div>
  );
}

export default Address;
