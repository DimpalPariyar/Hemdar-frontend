function Poster() {
  return (
    <div>
      <div className=" flex basis-2/4 items-center p-10 xl:px-28">
        <div className="p-10 size-1/2">
          <img src="./src/Images/Sling_bag.png" className="p-6 bg-white" />
        </div>
        <div className="p-10 text-justify size-1/2">
          <h1 className="font-bold text-5xl tracking-wider mb-5">
            Custom products
          </h1>
          <p className="my-4 font-medium">
            Shop and customize various crochet bags, earings, kitchens to your
            own taste here! From working with your preferred size, to working
            with your specified color theme, you can have it all!
          </p>
          <p className="my-4 font-medium">
            Always feel free to send an email if you need any clarification at
            all :)
          </p>
        </div>
      </div>

      <hr />

      <div className="bg-primaryBG flex flex-row-reverse basis-2/4 items-center p-10 xl:px-28 ">
        <div className="p-10 size-1/2">
          <img src="./src/Images/earing.png" className="p-6 " />
        </div>
        <div className="p-10 text-justify size-1/2">
          <h1 className="font-bold text-5xl tracking-wider mb-5">
            READY TO SHIP
          </h1>
          <p className="my-4 font-medium">
            All bags in this section will be processed for shipment within 10
            working days.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Poster;
