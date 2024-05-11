import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { inputCard } from "../../ReduxStoreSlice/cardSlice";

interface DoingCardProps {
  isOuterCardOpen: boolean;
  setIsOuterCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DoingCard: React.FC<DoingCardProps> = ({
  isOuterCardOpen,
  setIsOuterCardOpen,
}) => {
  // const [cards, setCards] = useState<JSX.Element[]>([]);
  const [openInput, setOpenInput] = useState(false);

  const dispatch = useDispatch();

  function handleAddCard(data) {
    // setCards((prevCards) => [
    //   ...prevCards,
    // (
    // console.log(data);

    dispatch(inputCard(data));

    // <InnerCard
    //   // key={prevCards.length}
    //   isOuterCardOpen={isOuterCardOpen}
    //   setIsOuterCardOpen={setIsOuterCardOpen}
    // />;
    // ),
    // ]);
    setOpenInput(false);
  }

  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: handleAddCard,
  });

  const content = useSelector((state) => {
    console.log(state.card.cards);
  });
  console.log(content);
  // console.log(values);

  return (
    <div className=" backdrop-blur-lg h-[500px] w-1/3 m-5 rounded-lg p-4 shadow">
      <div className="flex justify-between">
        <h1>Doing</h1>
        <div className="flex justify-between gap-2">
          <p className="bg-transparent p-1 text-gray-400 font-semibold">2</p>
          <button className="text-gray-400 bg-transparent p-2">
            <BsThreeDotsVertical />
          </button>
          <button
            onClick={() => setOpenInput(!openInput)}
            className="bg-gray-300 text-gray-600 rounded-md p-2"
          >
            <FaPlus />
          </button>
        </div>
      </div>
      {openInput && (
        <form onSubmit={handleSubmit}>
          <div className="mt-2 bg-white rounded-md w-full border-2 border-gray-300">
            <input
              value={values.title}
              onChange={handleChange}
              id="title"
              type="string"
              className="border-b-2 p-3 w-full border-gray-300 rounded-t-md"
              placeholder="Title"
            />
            <input
              value={values.description}
              onChange={handleChange}
              id="description"
              type="string"
              className="p-3 w-full rounded-b-md"
              placeholder="Description"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-300 rounded-md p-2 w-full"
            >
              Add Card
            </button>
          </div>
        </form>
      )}
      <div>cards</div>
    </div>
  );
};
