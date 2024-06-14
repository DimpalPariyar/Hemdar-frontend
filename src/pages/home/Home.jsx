import Banner from "./Banner";
import Category from "./Category";
// import Display from "./Display";
import Featured from "./Featured";
import Testimonials from "./Testimonials";
// import NewArrivals from "./NewArrivals";
// import Poster from "./Poster";

function Home() {
  return (
    <div>
      <Banner />
      <Category />
      <Testimonials />
      <Featured />
      {/* <Display /> */}
      {/* <NewArrivals /> */}
      {/* <Poster /> */}
    </div>
  );
}

export default Home;
