import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import Cards from "../../components/Cards";

function Products() {
  /*eslint-disable no-unused-vars*/

  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  useEffect(
    function () {
      const fetchData = async () => {
        try {
          const res = await fetch("products.json");
          const data = await res.json();
          console.log(data);
          setProducts(data);
          setFilteredItems(data);
        } catch (error) {
          console.log("Error fecthing data:", error);
        }
      };
      fetchData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setProducts, setFilteredItems]
  );

  //   console.log(products);

  function filterItems(category) {
    const filtered =
      category === "all"
        ? products
        : products.filter((item) => item.category === category);

    setFilteredItems(filtered);
    setSelectedCategory(category);
  }

  function showAll() {
    setFilteredItems(products);
    setSelectedCategory("all");
  }

  function handleSortChange(option) {
    setSortOption(option);

    let sortedItems = [...filteredItems];

    switch (option) {
      case "A-Z":
        sortedItems.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Z-A":
        sortedItems.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "low-to-high":
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilteredItems(sortedItems);
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-28 px-4 my-20">
      <h2 className="title">Products</h2>

      {/* product cart */}
      <div>
        <div className="flex flex-col md:flex-row flex-wrap md:justify-between items-centerspace-y-3 mb-8">
          {/* all btn */}
          <div className="flex flex-row justify-start md:items-center md:gap-8 gap-4 flex-wrap">
            <button onClick={showAll}>All Products</button>
            <button onClick={() => filterItems("Bag")}>Bags</button>
            <button onClick={() => filterItems("Earing")}>Earings</button>
            <button onClick={() => filterItems("Keychain")}>Keychains</button>
          </div>

          {/* sorting option */}
          <div className="flex justify-end mb-4 rounded-sm ">
            <div className="bg-black p-2">
              <FaFilter className="text-white h-4 w-4" />
            </div>

            <select
              id="sort"
              onChange={(e) => handleSortChange(e.target.value)}
              value={sortOption}
              className="bg-black text-white px-2 py-1 rounded-sm"
            >
              <option value="default">Default</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
              <option value="low-to-high">Low to High</option>
              <option value="high-to-low">High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 items-center justify-center gap-12">
          {filteredItems.map((item) => (
            <Cards item={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
