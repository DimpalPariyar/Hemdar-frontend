import { TiTick } from "react-icons/ti";
import { LiaRupeeSignSolid } from "react-icons/lia";

function PaymentSuccessfull() {
  return (
    <div className="flex flex-col items-center font-primary justify-center gap-1 m-12">
      <h1 className="text-green-500 text-2xl">Payment Successfull!</h1>
      <span className="my-4">
        <TiTick className="border-2 rounded-full text-green-500 border-green-500 size-8" />
      </span>
      <div className="flex justify-between w-[50%]">
        <p className="text-gray-500">Payment type</p>
        <p>Net Banking</p>
      </div>
      <div className="flex justify-between w-[50%]">
        <p className="text-gray-500">Bank</p>
        <p>HDFC</p>
      </div>
      <div className="flex justify-between w-[50%]">
        <p className="text-gray-500">Mobile</p>
        <p>9999999999</p>
      </div>
      <div className="flex justify-between w-[50%]">
        <p className="text-gray-500">Email</p>
        <p>abcdef@gmail.com</p>
      </div>
      <div className="flex justify-between w-[50%] my-4 font-bold">
        <p className="text-gray-500">Amount Paid</p>
        <p className="flex items-center">
          <LiaRupeeSignSolid />
          1000.00
        </p>
      </div>
      <div className="flex justify-between w-[50%]">
        <p className="text-gray-500">Transaction Id</p>
        <p>12345678921265</p>
      </div>
      <button className="bg-blue-500 text-white w-fit py-2 px-6 text-sm my-8">
        Close
      </button>
    </div>
  );
}

export default PaymentSuccessfull;
