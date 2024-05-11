import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import PersonalInfo from "../../components/PersonalInfo";
import Address from "../../components/Address";

function BillingDetails({ values, handleChange }) {
  return (
    <div className="my-4 mx-20 p-4">
      <div className="flex justify-between">
        <h1 className=" font-bold text-xl">Billing details</h1>
        <Link to={"/cart"}>
          <h1 className="flex gap-1 items-center">
            <IoIosArrowBack />
            Back to cart
          </h1>
        </Link>
      </div>

      <div className="w-full">
        <PersonalInfo values={values} handleChange={handleChange} />
        <Address values={values} handleChange={handleChange} />
      </div>
    </div>
  );
}

export default BillingDetails;
