import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

function SubNavbar({ setSubNavMenu }) {
  /*eslint-disable no-unused-vars*/
  // const [subNavMenu, setSubNavMenu] = useState(false);

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

  return (
    <div>
      <div
        onMouseLeave={() => {
          setSubNavMenu(false);
        }}
        className="bg-white mx-[348px] mb-8 font-primary"
      >
        <ul className="flex flex-col items-start justify-center my-2">
          {subNavItems.map(({ title, path }) => (
            <li
              key={title}
              className={`${
                title !== "Bags" && "hover:text-red-600 hover:underline"
              }`}
            >
              <Link to={path}>{title}</Link>
              {title === "Bags" && (
                <ul>
                  {subChildNavItems.map(({ title, path }) => (
                    <Link to={path} key={title}>
                      <li
                        key={title}
                        className=" pl-10 hover:text-red-600 hover:underline flex items-center gap-1"
                      >
                        <span className="text-xs">
                          <IoIosArrowForward />
                        </span>
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

      {/* only mobile menu items*/}
      {/* <div className="pt-4">
        <ul
          className={`bg-black text-white px-4 py-2 rounded ${
            isMenuOpen ? "" : "hidden"
          }`}
        >
          
          {navItems.map(({ title, path }) => (
            <li
              key={title}
              className=" hover:text-orange-500 my-3 cursor-pointer"
            >
              <Link to={path}>{title}</Link>
              {/* <a href="/">{title}</a> 
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}

export default SubNavbar;
