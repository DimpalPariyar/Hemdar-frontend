import { FaRegStar } from "react-icons/fa";

function Testimonials() {
  return (
    <div className="px-20 py-32 bg-[#FECAC8]">
      <h1 className="text-center font-primary font-semibold text-[32px]">
        Testimonials
      </h1>
      <div className="flex flex-col justify-center items-center pt-10 gap-2">
        <p className="font-primary text-xl text-center w-[458px]">
          Body text for a post. Since it’s a social app, sometimes it’s a hot
          take, and sometimes it’s a question.
        </p>
        <p className="flex text-xl gap-2">
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
          <FaRegStar />
        </p>
        <img src="/images/Svg images/Graphic.svg" className="size-[100px]" />
        <p className=" font-primary">Name</p>
      </div>
    </div>
  );
}

export default Testimonials;
