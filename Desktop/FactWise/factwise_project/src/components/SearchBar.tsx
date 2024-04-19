import { CiSearch } from "react-icons/ci";

interface Props {
  searchTerm: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<Props> = ({ searchTerm, handleSearch }) => {
  return (
    <div>
      <h1 className=" font-semibold">List View</h1>
      <div className="flex border-2 items-center gap-2 rounded-md border-gray-300 px-2 my-4">
        <CiSearch />
        <input
          type="text"
          placeholder="Search User"
          value={searchTerm}
          onChange={handleSearch}
          className="py-1 w-full focus:outline-none"
        />
      </div>
    </div>
  );
};

export default SearchBar;
