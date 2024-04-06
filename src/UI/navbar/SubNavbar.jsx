import { useState } from "react";
import { Link } from "react-router-dom";
// import { IoIosArrowForward } from "react-icons/io";

function SubNavbar({ isMenuOpen }) {
  /*eslint-disable no-unused-vars*/
  const [subNavMenu, setSubNavMenu] = useState(false);
  const [subChildNavMenu, setChildSubNavMenu] = useState(false);

  const navItems = [
    { title: "Shop", path: "/products" },
    { title: "Sale", path: "/products" },
    { title: "New Arrivals", path: "/products" },
    { title: "Best Seller", path: "/products" },
  ];

  return (
    <div>
      <hr />

      {/* category items */}
      <div className="pt-4">
        <ul className="flex items-center justify-between gap-40 text-black ">
          {navItems.map(({ title, path }) => (
            <li
              onMouseEnter={() => {
                title === "Shop" && setSubNavMenu(true);
              }}
              key={title}
              className=" hover:text-orange-500 hover:underline "
            >
              <Link to={path}>{title}</Link>
              {/* <a href="/">{title}</a> */}
            </li>
          ))}
        </ul>
      </div>

      <div>
        {subNavMenu && (
          <SubNav
            setSubNavMenu={setSubNavMenu}
            setChildSubNavMenu={setChildSubNavMenu}
            subChildNavMenu={subChildNavMenu}
          />
        )}
      </div>
      {/* <div>{subChildNavMenu && <SubChildNav />}</div> */}

      {/* only mobile menu items*/}
      <div className="pt-4">
        <ul
          className={`bg-black text-white px-4 py-2 rounded ${
            isMenuOpen ? "" : "hidden"
          }`}
        >
          {/*eslint-disable no-unused-vars*/}
          {navItems.map(({ title, path }) => (
            <li
              key={title}
              className=" hover:text-orange-500 my-3 cursor-pointer"
            >
              <Link to={path}>{title}</Link>
              {/* <a href="/">{title}</a> */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SubNavbar;

const subNavItems = [
  { title: "Bags", path: "/products" },
  { title: "Earings", path: "/products" },
  { title: "Keychains", path: "/products" },
];

const subChildNavItems = [
  { title: "Handbags / Capri Bags", path: "/products" },
  { title: "Sling Bags", path: "/products" },
  { title: "Wallets", path: "/products" },
  { title: "Tote Bags", path: "/products" },
];

function SubNav({ setSubNavMenu }) {
  return (
    <div
      onMouseLeave={() => {
        setSubNavMenu(false);
      }}
    >
      <ul className="flex flex-col items-start justify-center my-2">
        {subNavItems.map(({ title, path }) => (
          <li
            key={title}
            className={`${
              title !== "Bags" && "hover:text-orange-500 hover:underline"
            }`}
          >
            <Link to={path}>{title}</Link>
            {title === "Bags" && (
              <ul>
                {subChildNavItems.map(({ title, path }) => (
                  <Link to={path} key={title}>
                    <li
                      key={title}
                      className=" pl-10 hover:text-orange-500 hover:underline"
                    >
                      {/* <span>
                        <IoIosArrowForward />
                      </span> */}
                      {title}
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// function SubChildNav({ setChildSubNavMenu }) {
//   const subChildNavItems = [
//     { title: "Handbags / Capri Bags", path: "/products" },
//     { title: "Sling Bags", path: "/products" },
//     { title: "Wallets", path: "/products" },
//     { title: "Tote Bags", path: "/products" },
//   ];

//   return (
//     <div onMouseLeave={() => setChildSubNavMenu(false)}>
//       <ul className="flex items-center justify-center gap-40 my-2">
//         {subChildNavItems.map(({ title, path }) => (
//           <li key={title} className=" hover:text-orange-500 hover:underline ">
//             <Link to={path}>{title}</Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// collection
const bagcollection = [{}];
