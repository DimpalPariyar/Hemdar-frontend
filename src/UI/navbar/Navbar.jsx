import { useEffect, useState } from "react";
import { FaRegUserCircle, FaRegHeart, FaTimes, FaBars } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import { PiHandbagSimpleBold } from "react-icons/pi";
import { IoMdLogOut } from "react-icons/io";

import { IoSearch } from "react-icons/io5";

import SubNavbar from "./SubNavbar";
import { Link, useNavigate } from "react-router-dom";
import { useGetCountOfItemsInCartQuery } from "../../apiSlice/addToCartApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { countRefetch } from "../../reduxStoreSlice/countSlice";
import { useLogoutMutation } from "../../apiSlice/authApiSlice";
import { logoutSuccess } from "../../reduxStoreSlice/authSlice";

function Navbar() {
  const [logout, { data: logoutUser, isLoading }] = useLogoutMutation();
  // console.log(logoutUser);

  const navigate = useNavigate();
  function handleLogout() {
    logout();
  }

  const { data: count, refetch } = useGetCountOfItemsInCartQuery();
  // console.log(count);

  const dispatch = useDispatch();
  const refetchCount = useSelector((state) => state.count);
  // console.log(refetchCount);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // console.log(isLoggedIn);

  useEffect(() => {
    if (logoutUser?.result?.acknowledged) {
      dispatch(logoutSuccess());
      sessionStorage.setItem("isLoggedIn", "false");
      navigate("/");
    }
  }, [logoutUser]);

  useEffect(() => {
    refetch();
  }, [refetchCount]);

  useEffect(() => {
    dispatch(countRefetch(false));
  }, [refetchCount]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const location = useLocation();

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  const [subNavMenu, setSubNavMenu] = useState(false);
  // const [subChildNavMenu, setChildSubNavMenu] = useState(false);

  const navItems = [
    { title: "Home", path: "/" },
    { title: `Shop`, path: "/products" },
    // { title: "Blog", path: "/" },
    { title: "About Us", path: "/Aboutus" },
    { title: "Contact Us", path: "/contactus" },
  ];

  return (
    <header className="px-12 fixed bg-white w-[100%] z-[10000] pt-4">
      <nav className="flex justify-between items-center gap-14 xl:gap-6 h-[100px]">
        <Link to={"/"}>
          <div className="flex gap-2 justify-center items-center">
            <img
              src="images/Logo/Hemdar logo (1).svg"
              alt="hemdar log"
              className="size-24 sm:size-[130px]"
              // className="h-full sm:h-40 w-24 sm:w-40"
            />
          </div>
        </Link>

        <div className="hidden lg:block">
          <ul className="flex items-center justify-between gap-6 xl:gap-10 text-sm xl:text-lg font-primary font-medium ">
            {navItems.map(({ title, path }) => (
              <li
                onMouseEnter={() => {
                  title === "Shop" && setSubNavMenu(true);
                }}
                key={title}
                className=" hover:text-red-600 hover:underline flex item-center justify-center gap-1"
              >
                <Link to={path}>{title}</Link>
                {title === "Shop" && (
                  <span className="flex item-center">
                    <img src="images/Svg images/Vector 134 (Stroke).svg" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="font-normal font-primary gap-6 items-center justify-center pr-20 z-10000 hidden lg:flex">
          {isLoggedIn && (
            <Link to={"/admin"} className="flex flex-col items-center">
              <GrUserAdmin className="text-[#595667] xl:text-xl" />
              <p className="font-primary text-[#595667] text-xs xl:text-sm font-medium">
                ADMIN
              </p>
              {/* Admin */}
            </Link>
          )}

          <Link to={`/`} className="flex flex-col items-center">
            <IoSearch className="text-[#595667] xl:text-2xl" />
            {/* <p className="font-primary text-[#595667] text-xs xl:text-sm font-medium">
              SEARCH
            </p> */}
            {/* Account */}
          </Link>

          <Link
            to={`${isLoggedIn ? "/account" : "/login"}`}
            className="flex flex-col items-center"
          >
            <FaRegUserCircle className="text-[#595667] xl:text-xl" />
            {/* <p className="font-primary text-[#595667] text-xs xl:text-sm font-medium">
              {isLoggedIn ? "ACCOUNT" : "LOGIN"}
            </p> */}
            {/* Account */}
          </Link>

          {isLoggedIn && (
            <Link to={"/wishlist"} className="flex flex-col items-center">
              <FaRegHeart className="text-[#595667] xl:text-xl" />
              {/* <p className="text-[#595667] font-primary text-xs xl:text-sm font-medium">
                WISHLIST
              </p> */}
              {/* Whishlist */}
            </Link>
          )}

          {isLoggedIn && (
            <Link to={"/cart"} className="flex flex-col items-center relative">
              <PiHandbagSimpleBold className="text-[#595667] xl:text-xl" />

              {/* <p className="text-[#595667] font-primary text-xs xl:text-sm font-medium">
                BAG
              </p> */}
              {count?.Count > 0 && (
                <div className="bg-red-500 text-white rounded-full size-4 text-[10px] flex items-center justify-center absolute bottom-3 left-3">
                  {count?.Count}
                </div>
              )}
              {/* Cart */}
            </Link>
          )}

          {isLoggedIn && (
            <button
              className="flex flex-col items-center"
              onClick={() => handleLogout()}
              disabled={isLoading}
            >
              <IoMdLogOut className="text-[#595667] xl:text-xl" />
              {/* <p className="text-[#595667] font-primary  text-xs xl:text-sm font-medium">
                LOGOUT
              </p> */}
            </button>
          )}
        </div>

        {/* navBar for sm devices */}
        <div className="lg:hidden ">
          <button className=" relative" onClick={toggleMenu}>
            {isMenuOpen ? (
              <FaTimes className="w-5 h-5 text-black" />
            ) : (
              <FaBars className="w-5 h-5 text-black" />
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute right-10 bg-white p-2">
              <ul className="flex flex-col gap-2">
                <Link to={"/products"}>
                  <li className="flex items-center gap-1 border-2 border-gray-400 px-2">
                    Shop <img src="images/Svg images/Vector 134 (Stroke).svg" />
                  </li>
                </Link>

                {isLoggedIn && (
                  <Link to={"/admin"}>
                    <li className="flex items-center gap-1 border-2 border-gray-400 px-2">
                      Admin <GrUserAdmin />
                    </li>
                  </Link>
                )}

                <Link to={`${isLoggedIn ? "/account" : "/login"}`}>
                  <li className="flex items-center gap-1 border-2 border-gray-400 px-2">
                    {isLoggedIn ? "Account" : "Login"} <FaRegUserCircle />
                  </li>
                </Link>

                {isLoggedIn && (
                  <Link to={"/wishlist"}>
                    <li className="flex items-center gap-1 border-2 border-gray-400 px-2">
                      Whishlist <FaRegHeart />
                    </li>
                  </Link>
                )}

                {isLoggedIn && (
                  <Link to={"/cart"}>
                    <li className="flex items-center gap-1 border-2 border-gray-400 px-2">
                      Bag <PiHandbagSimpleBold />
                    </li>
                  </Link>
                )}

                {isLoggedIn && (
                  <button onClick={() => handleLogout()} disabled={isLoading}>
                    <li className="flex items-center gap-1 border-2 border-gray-400 px-2">
                      Logout <IoMdLogOut />
                    </li>
                  </button>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>

      <div>{subNavMenu && <SubNavbar setSubNavMenu={setSubNavMenu} />}</div>

      {/* {location.pathname === "/" && <SubNavbar isMenuOpen={isMenuOpen} />} */}
    </header>
  );
}

export default Navbar;
