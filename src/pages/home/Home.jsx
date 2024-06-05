import Banner from "./Banner";
import Category from "./Category";
import Featured from "./Featured";
import Testimonials from "./Testimonials";
// import NewArrivals from "./NewArrivals";
// import Poster from "./Poster";

function Home() {
  return (
    <div>
      <Banner />
      <Category />
      <Featured />
      <Testimonials />
      {/* <NewArrivals /> */}
      {/* <Poster /> */}
    </div>
  );
}

export default Home;
