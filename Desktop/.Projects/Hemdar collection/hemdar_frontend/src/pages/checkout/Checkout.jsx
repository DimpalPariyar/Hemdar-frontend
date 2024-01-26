import BillingDetails from "./BillingDetails";
import Payment from "./Payment";

function Checkout() {
  return (
    <div className=" my-24 flex mx-10">
      <div className=" basis-[60%]">
        <BillingDetails />
      </div>

      <div className=" basis-[40%] bg-primaryBG">
        <Payment />
      </div>
    </div>
  );
}

export default Checkout;
