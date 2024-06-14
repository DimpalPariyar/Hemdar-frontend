import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Loading() {
  return (
    <div className="">
      <span className="size-[200px] animate-spin">
        <AiOutlineLoading3Quarters />
      </span>
    </div>
  );
}

export default Loading;
