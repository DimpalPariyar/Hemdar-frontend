import UserCard from "./components/UserCard";
import { useSelector } from "react-redux";

interface Props {
  handleDelete: (id: number) => void;
}

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

const UserList: React.FC<Props> = ({ handleDelete }) => {
  const updateData = (data: Celebrity) => {
    console.log(data);
  };

  const celebrities: Celebrity[] = useSelector(
    (state: any) => state.data.items
  );

  //   console.log(celebrities);

  return (
    <div>
      {celebrities.length > 0 &&
        celebrities.map((celebrity: Celebrity) => {
          return (
            <UserCard
              key={celebrity.id}
              celebrity={celebrity}
              updateData={updateData}
              handleDelete={handleDelete}
            />
          );
        })}
    </div>
  );
};

export default UserList;
