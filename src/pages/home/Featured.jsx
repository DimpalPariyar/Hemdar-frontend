import { LiaRupeeSignSolid } from "react-icons/lia";

function Featured() {
  const products = [
    {
      id: 1,
      title: "hand bag",
      category: "BAGS",
      description: "Description of product",
      price: 2500,
      image: "images/Hand_Bag.png",
      status: "Featured",
    },
    {
      id: 2,
      title: "Black bag",
      category: "BAGS",
      description: "Description of product",
      price: 1300.0,
      image: "images/IMG_bag_black.jpg",
      status: "Featured",
    },

    {
      id: 3,
      title: "white and green bag",
      category: "BAGS",
      description: "Description of product",
      price: 1500,
      image: "images/IMG_bag_whitegreen.jpg",
      status: "Featured",
    },
  ];

  return (
    <div className="px-20 py-24">
      <h1 className="text-center font-primary font-semibold text-[32px]">
        FEATURED
      </h1>
      <div className="flex flex-col sm:flex-row sm:gap-6 lg:gap-10 py-9">
        {products.map((item) => (
          <div key={item.id} className="flex flex-col gap-2">
            <img
              src={item.image}
              alt={item.title}
              className="h-[340px] w-[400px] rounded-lg"
            />
            <p className=" font-primary font-medium text-xl w-full">
              {item.title}
            </p>
            <p className="font-primary font-medium text-xl text-[#828282] w-full">
              {item.description}
            </p>
            <p className="flex items-center font-primary font-medium text-xl w-full">
              <span>
                <LiaRupeeSignSolid />
              </span>
              {item.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Featured;
