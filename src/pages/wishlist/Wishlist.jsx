import { Link } from "react-router-dom";
import { useGetWishlistQuery } from "../../apiSlice/addToWishlistApiSlice";
import Cards from "../../components/Cards";
import { IoIosArrowBack } from "react-icons/io";

function Wishlist() {
  const { data: products, refetch } = useGetWishlistQuery();

  // console.log(products, isSuccess);

  return (
    <div className="my-20">
      <h1 className="text-center font-semibold text-4xl font-primary">
        Wishlist
      </h1>

      <div>
        {products?.items.length === 0 ? (
          <div className="flex flex-col justify-center items-center my-10">
            <p className=" font-semibold text-2xl">Your wishlist is empty!!</p>
            <Link
              className=" font-medium text-lg text-blue-400 underline"
              to={"/products"}
            >
              Keep Shopping
            </Link>
          </div>
        ) : (
          <div>
            <div className="p-4">
              <Link to={"/products"}>
                <h1 className="flex gap-1 items-center">
                  <IoIosArrowBack />
                  Continue Shopping
                </h1>
              </Link>
            </div>
            <hr />
            <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center justify-center gap-12">
              {products?.items.map((item) => (
                <Cards
                  item={item}
                  key={item._id}
                  wishlist={true}
                  refetchWishlist={refetch}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
