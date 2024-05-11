import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import InnerCard from "../innerCards/InnerCard";
import { useState } from "react";

interface DoneCardProps {
  isOuterCardOpen: boolean;
  setIsOuterCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DoneCard: React.FC<DoneCardProps> = ({
  isOuterCardOpen,
  setIsOuterCardOpen,
}) => {
  const [cards, setCards] = useState<JSX.Element[]>([]);

  function handleAddCard() {
    setCards((prevCards) => [
      ...prevCards,
      <InnerCard
        key={prevCards.length}
        isOuterCardOpen={isOuterCardOpen}
        setIsOuterCardOpen={setIsOuterCardOpen}
      />,
    ]);
  }
  return (
    <div className=" backdrop-blur-lg h-[500px] w-1/3 m-5 rounded-lg p-4 shadow">
      <div className="flex justify-between">
        <h1>Done</h1>
        <div className="flex justify-between gap-2">
          <p className="bg-transparent p-1 text-gray-400 font-semibold">2</p>
          <button className="text-gray-400 bg-transparent p-2">
            <BsThreeDotsVertical />
          </button>
          <button
            onClick={handleAddCard}
            className="bg-gray-300 text-gray-600 rounded-md p-2"
          >
            <FaPlus />
          </button>
        </div>
      </div>
      <div>{cards}</div>
    </div>
  );
};
