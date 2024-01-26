/*eslint-disable no-unused-vars*/

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";

import Cards from "../../components/Cards";
import { useEffect, useState } from "react";

function NewArrivals() {
  const [products, setProducts] = useState([]);
  // const [status, setStatus] = useState("new arrivals");

  useEffect(
    function () {
      const fetchData = async () => {
        try {
          const res = await fetch("products.json");
          const data = await res.json();
          const filteredData = data.filter(
            (product) => product.status === "new arrivals"
          );
          // console.log(filteredData);
          setProducts(filteredData);
        } catch (error) {
          console.log("Error fecthing data:", error);
        }
      };
      fetchData();
    },
    [setProducts]
  );
  return (
    <div className="bg-primaryBG  ">
      <div className=" text-center container mx-auto xl:px-28 px-4 py-14 mb-12">
        <div className="m-4">
          <h1 className="text-4xl font-extrabold">New Arrivals</h1>
          <p className="text-l">Some of our favourite picks this week.</p>
        </div>

        <div>
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 50,
              },
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            {/* {products.filter(=>i.status)} */}
            {products.map((item) => {
              return (
                <SwiperSlide key={item.id}>
                  <Cards item={item} key={item.id} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default NewArrivals;
