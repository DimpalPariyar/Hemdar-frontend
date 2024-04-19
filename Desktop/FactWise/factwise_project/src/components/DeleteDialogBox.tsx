import { RxCross1 } from "react-icons/rx";

interface Props {
  setDeleteDialogbox: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  handleDelete: (id: number) => void;
}

const DeleteDialogBox: React.FC<Props> = ({
  setDeleteDialogbox,
  id,
  handleDelete,
}) => {
  return (
    <div className="border-2 border-gray-300 p-6 rounded-xl flex flex-col justify-between gap-10">
      <div className="flex justify-between">
        <h1 className=" text-lg">Are you sure you want to delete?</h1>
        <RxCross1
          className=" text-gray-500 font-bold text-xl"
          onClick={() => setDeleteDialogbox(false)}
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          className="border-2 p-2 w-28 rounded-xl border-gray-300"
          onClick={() => setDeleteDialogbox(false)}
        >
          Cancel
        </button>
        <button
          onClick={() => handleDelete(id)}
          className="border-2 bg-red-500 text-white p-2 w-28 rounded-xl border-gray-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteDialogBox;
