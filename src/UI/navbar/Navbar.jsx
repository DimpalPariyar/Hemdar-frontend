import { useEffect, useState } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";

import { IoMdLogOut } from "react-icons/io";

import SubNavbar from "./SubNavbar";
import { Link, useLocation } from "react-router-dom";
import { useGetCountOfItemsInCartQuery } from "../../apiSlice/addToCartApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { countRefetch } from "../../reduxStoreSlice/countSlice";

function Navbar() {
  const { data: count, refetch } = useGetCountOfItemsInCartQuery();
  console.log(count);

  const dispatch = useDispatch();
  const refetchCount = useSelector((state) => state.count);
  // console.log(refetchCount);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // console.log(isLoggedIn);

  useEffect(() => {
    refetch();
  }, [refetchCount]);

  useEffect(() => {
    dispatch(countRefetch(false));
  }, [refetchCount]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className="bg-white max-w-screen-2xl xl:px-28 px-4 fixed top-0 right-0 left-0 z-10000">
      <nav className="flex justify-between items-center container md:py-4 pt-6 pb-3 ">
        <FaSearch className="text-black w-5 h-5 cursor-pointer hidden md:block" />

        <Link to={"/"}>
          {/* <img src="../src/images/Logo.jpg" className=" h-16 w-80" /> */}
          <div className="flex gap-2 justify-center items-center">
            <div>
              <img src="../src/images/Logo img.jpg" className="w-12 h-12" />
            </div>
            <div>
              <h1 className="font-medium text-2xl">Hemdar Collection</h1>
              <p className=" font-light pl-1 text-sm">Handmade Accessories</p>
            </div>
          </div>
        </Link>

        <div className="text-lg text-black sm:flex items-center gap-4 hidden z-10000">
          <Link to={"/admin"} className="flex items-center gap-2">
            <RiAdminFill />
            {/* Admin */}
          </Link>

          <Link
            to={`${isLoggedIn ? "/account" : "/login"}`}
            className="flex items-center gap-2"
          >
            <FaUser />
            {/* Account */}
          </Link>

          <Link to={"/products"} className="flex items-center gap-2">
            <FaShoppingBag />
            {/* Shop */}
          </Link>

          {isLoggedIn && (
            <Link to={"/cart"} className="flex items-center gap-2 relative">
              <FaShoppingCart />
              {count?.Count > 0 && (
                <div className="bg-red-500 text-white rounded-full size-4 text-[10px] flex items-center justify-center absolute bottom-3 left-3">
                  {count?.Count}
                </div>
              )}
              {/* Cart */}
            </Link>
          )}

          {isLoggedIn && (
            <Link to={"/wishlist"} className="flex items-center gap-2">
              <FaHeart />
              {/* Whishlist */}
            </Link>
          )}

          {isLoggedIn && (
            <Link to={"/"} className="flex items-center gap-2">
              <IoMdLogOut />
              {/* Logout */}
            </Link>
          )}
        </div>

        {/* navBar for sm devices */}
        <div className="sm:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? (
              <FaTimes className="w-5 h-5 text-black" />
            ) : (
              <FaBars className="w-5 h-5 text-black" />
            )}
          </button>
        </div>
      </nav>

      {location.pathname === "/" && <SubNavbar isMenuOpen={isMenuOpen} />}
    </header>

    // <div className="flex flex-col fixed w-full">
    //   <div className="  p-0.1 font-serif font-medium text-sm   text-center">
    //     Customized handmade products
    //   </div>
    //   <div className="flex justify-between item-center px-4 gap-2 bg-gradient-to-r ">
    //     <div className="flex gap-2 justify-center items-center">
    //       <div>
    //         <img src="./src/Images/Logo img.jpg" className="w-12 h-12" />
    //       </div>
    //       <div>
    //         <h1 className="font-medium text-3xl">Hemdar Collection</h1>
    //         <p>Handmade Accessories</p>
    //       </div>
    //     </div>
    //     <div className="text-m text-center py-4">
    //       <ul className="py-2.5 cursor-pointer flex gap-5 justify-center items-center">
    //         <li className="hover:underline hover:underline-offset-8 ">Home</li>
    //         <li className="hover:underline hover:underline-offset-8 ">
    //           Shop
    //           <div className="hidden">
    //             <ul>
    //               <li>Bags</li>
    //               <li>Earings</li>
    //               <li>Kitchens</li>
    //             </ul>
    //           </div>
    //         </li>
    //         <li className="hover:underline hover:underline-offset-8 ">
    //           New Arrivals
    //         </li>
    //         <li className="hover:underline hover:underline-offset-8 ">
    //           Best Seller
    //         </li>
    //       </ul>
    //     </div>

    //     <div className="flex justify-between space-x-5 items-center ">
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         strokeWidth={1.5}
    //         stroke="currentColor"
    //         className="w-6 h-6 cursor-pointer"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    //         />
    //       </svg>
    //       search
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         strokeWidth="1.5"
    //         stroke="currentColor"
    //         className="w-6 h-6 cursor-pointer"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    //         />
    //       </svg>
    //       heart
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         strokeWidth={1.5}
    //         stroke="currentColor"
    //         className="w-6 h-6 cursor-pointer"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
    //         />
    //       </svg>
    //       cart
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         strokeWidth={1.5}
    //         stroke="currentColor"
    //         className="w-6 h-6 cursor-pointer"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
    //         />
    //       </svg>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Navbar;
