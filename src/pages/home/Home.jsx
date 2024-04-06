import Banner from "./Banner";
// import Banner1 from "./Banner1";
import Category from "./Category";
import NewArrivals from "./NewArrivals";
import Poster from "./Poster";

function Home() {
  return (
    <div>
      {/* <Banner1 /> */}
      <Banner />
      <Category />
      <NewArrivals />
      <Poster />
    </div>
  );
}

export default Home;
