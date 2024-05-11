import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import DialogBox from "../DialogBox";

interface OpenInnerCardProps {
  isOpen: boolean;
  // onClose: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export const OpenInnerCard: React.FC<OpenInnerCardProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLabelOpen, SetIsLabelOpen] = useState(false);

  return (
    <DialogBox isOpen={isOpen} onClose={onClose}>
      <div className="ml-[425px] mt-[35px] w-full h-full p-6">
        <div className="bg-white w-[35%] h-full pb-8 rounded-lg m-4">
          <div className="flex justify-between items-center p-4 border-b-2">
            <div className="flex gap-6">
              <h1>Details</h1>
              <h1>Activity</h1>
              <h1>Timing</h1>
            </div>
            <div>
              <button onClick={onClose}>
                <RxCross2 />
              </button>
            </div>
          </div>
          <div className="mt-4 ml-14">
            <p className=" text-xs text-gray-400 font-semibold">
              30 Mar 2023 at 07:05 PM
            </p>
          </div>
          <div className="flex items-center gap-4 m-4">
            <select className="border-2 border-gray-200 rounded-md p-1">
              <option>No Priority</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Normal</option>
              <option>Low</option>
            </select>
            <span className="border-2 border-green-400 text-green-400 rounded-full p-1 text-xl">
              <TiTick />
            </span>
          </div>
          <div className="flex justify-between m-6 bg-gray-100 p-2 rounded-md items-center">
            <p>Add color labels</p>
            <button onClick={() => SetIsLabelOpen(!isLabelOpen)}>
              {isLabelOpen ? <RxCross2 /> : <FaPlus />}
            </button>
          </div>
          {isLabelOpen && (
            <div className="m-6 shadow border rounded-md grid grid-cols-2 gap-4 p-4">
              <input
                className="border-2 p-2 rounded-md border-blue-800 col-span-2"
                placeholder="Search"
              />
              <p className="rounded-md p-2 bg-orange-400 text-white">
                Features
              </p>
              <p className="rounded-md p-2 bg-blue-400 text-white">FAQ</p>
              <p className="rounded-md p-2 bg-green-400 text-white">Info</p>
              <p className="rounded-md p-2 bg-indigo-400 text-white">
                Google Workspace...
              </p>
            </div>
          )}

          <div className="m-6 border-2 border-gray-300 rounded-md">
            <input
              className="border-b-2 p-3 w-full border-gray-300 rounded-t-md"
              placeholder="Title"
            />
            <input
              className="p-3 w-full rounded-b-md"
              placeholder="Description"
            />
          </div>
        </div>
      </div>
    </DialogBox>
  );
};
