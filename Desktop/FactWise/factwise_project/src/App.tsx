import { useEffect, useState } from "react";
import UserList from "./UserList";
import SearchBar from "./components/SearchBar";
import "./styles.css";
import { useDispatch } from "react-redux";
import { setData, filterData, deleteData } from "./dataSlice";

interface Celebrity {
  id: number;
  first: string;
  last: string;
  dob: string;
  gender: string;
  email: string;
  picture: string;
  country: string;
  description: string;
}

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/celebrities.json");
        const data: Celebrity[] = await res.json();

        dispatch(setData(data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  function handleDelete(id: number) {
    dispatch(deleteData(id));
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    dispatch(filterData(searchTerm));
  };
  return (
    <section className=" w-[50%] mx-[25%] my-10">
      <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
      <UserList handleDelete={handleDelete} />
    </section>
  );
};

export default App;
