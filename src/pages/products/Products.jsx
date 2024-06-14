import { useEffect, useState } from "react";
import Cards from "../../components/Cards";

// import { FaFilter } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";

import { useGetAllProductsQuery } from "../../apiSlice/addProductApiSlice";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";

function Products() {
  /*eslint-disable no-unused-vars*/

  // const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [isCategoryChecked, setIsCategoryChecked] = useState({
    Accessories: false,
    Bags: false,
    Earings: false,
    HomeDecor: false,
    Outfits: false,
    Keychains: false,
    CustomizedOrders: false,
  });
  const [isPriceChecked, setIsPriceChecked] = useState({
    from0to1000: false,
    from1001to2000: false,
    from2001Above: false,
  });

  const { data: products, isSuccess, isLoading } = useGetAllProductsQuery();

  useEffect(() => {
    if (isSuccess) {
      setFilteredItems(() => {
        const filteredCategory = [];
        const filteredPrice = [];
        const priceRangeProduct = [];

        for (const key in isCategoryChecked) {
          if (isCategoryChecked[key]) {
            filteredCategory.push(key);
          }
        }

        for (const key in isPriceChecked) {
          if (isPriceChecked[key]) {
            filteredPrice.push(key);
          }
        }

        const categoryProduct = products.filter((product) =>
          filteredCategory.includes(product.category)
        );

        for (let i = 0; i < filteredPrice.length; i++) {
          const value = filteredPrice[i];
          if (value === "from0to1000") {
            const result = categoryProduct.filter(
              (product) =>
                (product.discountedPrice
                  ? product.discountedPrice
                  : product.price) <= 1000
            );
            priceRangeProduct.push(result);
          }
          if (value === "from1001to2000") {
            const result = categoryProduct.filter(
              (product) =>
                (product.discountedPrice
                  ? product.discountedPrice
                  : product.price) >= 1001 &&
                (product.discountedPrice
                  ? product.discountedPrice
                  : product.price) <= 2000
            );
            priceRangeProduct.push(result);
          }
          if (value === "from2001Above") {
            const result = categoryProduct.filter(
              (product) =>
                (product.discountedPrice
                  ? product.discountedPrice
                  : product.price) >= 2001
            );
            priceRangeProduct.push(result);
          }
        }

        const data =
          categoryProduct.length === 0 && priceRangeProduct.length === 0
            ? products
            : priceRangeProduct.length === 0
            ? categoryProduct
            : priceRangeProduct.flat();

        return data;
      });
    }
  }, [products, isSuccess, isCategoryChecked, isPriceChecked]);

  function handleFilterItem(e, category) {
    setIsCategoryChecked((prev) => {
      return { ...prev, [category]: e.target.checked };
    });
  }
  function handlePriceFilterItem(e, price) {
    setIsPriceChecked((prev) => {
      return { ...prev, [price]: e.target.checked };
    });
  }

  function handleSortChange(option) {
    setSortOption(option);

    let sortedItems = [...filteredItems];

    switch (option) {
      // case "default":
      //   filteredItems;
      //   break;
      case "A-Z":
        sortedItems.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Z-A":
        sortedItems.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "low-to-high":
        sortedItems.sort((a, b) => {
          const low = a.discountedPrice ? a.discountedPrice : a.price;
          const high = b.discountedPrice ? b.discountedPrice : b.price;
          return low - high;
        });
        break;
      case "high-to-low":
        sortedItems.sort((a, b) => {
          const low = a.discountedPrice ? a.discountedPrice : a.price;
          const high = b.discountedPrice ? b.discountedPrice : b.price;
          return high - low;
        });
        break;
      default:
        break;
    }
    setFilteredItems(sortedItems);
  }

  return (
    <div className="py-12 px-24 font-primary">
      <div className="flex gap-1 mb-6">
        <Link to={"/"}>
          <p className="text-[#807F86]">Home</p>
        </Link>
        <Link to={"/products"}>
          <p>/ Shop</p>
        </Link>
      </div>

      <div className="flex gap-12">
        <div className="flex flex-col gap-4 basis-1/6 w-[160px]">
          <p className="py-4 border-b-2 border-[#807F86] font-semibold text-[#374151]">
            Showing {filteredItems.length} items
          </p>

          {/* Category list */}

          <div className="py-4 border-b-2 border-[#807F86] flex flex-col gap-3">
            <h1 className="text-[#3A3845] font-semibold">Category</h1>
            <ul className="text-[#374151] text-sm flex flex-col gap-3">
              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isCategoryChecked.Accessories}
                  onChange={(e) => handleFilterItem(e, "Accessories")}
                />
                <p className="">Accessories</p>
              </li>

              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isCategoryChecked.Bag}
                  onChange={(e) => handleFilterItem(e, "Bags")}
                />
                <p>Bags</p>
              </li>

              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 checked:bg-red-400"
                  checked={isCategoryChecked.Earing}
                  onChange={(e) => handleFilterItem(e, "Earings")}
                />
                <p>Earings</p>
              </li>

              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isCategoryChecked.HomeDecor}
                  onChange={(e) => handleFilterItem(e, "HomeDecor")}
                />
                <p>Home Decor</p>
              </li>

              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isCategoryChecked.Outfits}
                  onChange={(e) => handleFilterItem(e, "Outfits")}
                />
                <p>Outfits</p>
              </li>

              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isCategoryChecked.Keychains}
                  onChange={(e) => handleFilterItem(e, "Keychains")}
                />
                <p>Keychains</p>
              </li>

              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isCategoryChecked.CustomizedOrders}
                  onChange={(e) => handleFilterItem(e, "CustomizedOrders")}
                />
                <p>Customized Orders</p>
              </li>
            </ul>
          </div>
          {/* Price list */}
          <div className="py-4 border-b-2 border-[#807F86] flex flex-col gap-3">
            <h1 className="text-[#3A3845] font-semibold">Price Range</h1>
            <ul className="text-[#374151] text-sm flex flex-col gap-3">
              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isPriceChecked.from0to1000}
                  onChange={(e) => handlePriceFilterItem(e, "from0to1000")}
                />
                <p className="flex items-center">
                  <FaIndianRupeeSign />
                  0 -
                  <FaIndianRupeeSign />
                  1000
                </p>
              </li>
              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isPriceChecked.from1001to2000}
                  onChange={(e) => handlePriceFilterItem(e, "from1001to2000")}
                />
                <p className="flex items-center">
                  <FaIndianRupeeSign />
                  1001 - <FaIndianRupeeSign />
                  2000
                </p>
              </li>
              <li className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={isPriceChecked.from2001Above}
                  onChange={(e) => handlePriceFilterItem(e, "from2001Above")}
                />
                <p className="flex items-center">
                  <FaIndianRupeeSign />
                  2001 & above
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className=" basis-5/6">
          {/* sorting option */}
          <div className="flex justify-end mb-4 rounded-sm text-[#3A3845]">
            <p>Sort By:</p>
            {/* <div className="bg-black p-2">
              <FaFilter className="text-white h-4 w-4" />
            </div> */}

            <select
              id="sort"
              onChange={(e) => handleSortChange(e.target.value)}
              value={sortOption}
              className="px-2 py-1"
            >
              <option value="default">Default</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
              <option value="low-to-high">Low to High</option>
              <option value="high-to-low">High to Low</option>
            </select>
          </div>
          {isLoading && <Loading />}
          {!isLoading && (
            <div>
              {filteredItems.length === 0 ? (
                <p className=" font-primary text-center text-3xl pt-[150px] ">
                  No products found !!!
                </p>
              ) : (
                <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center justify-center gap-8">
                  {filteredItems?.map((item) => (
                    <Cards item={item} key={item._id} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
