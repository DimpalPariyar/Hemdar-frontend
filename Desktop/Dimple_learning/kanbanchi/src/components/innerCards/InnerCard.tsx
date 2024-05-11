import { useSelector } from "react-redux";
import { inputCard } from "../../ReduxStoreSlice/cardSlice";

interface InnerCardProps {
  isOuterCardOpen: boolean;
  setIsOuterCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InnerCard: React.FC<InnerCardProps> = ({
  isOuterCardOpen,
  setIsOuterCardOpen,
}) => {
  const content = useSelector((state) => {
    state.card.cards;
  });
  console.log(content);
  return (
    <>
      <div
        className="bg-white m-4 rounded-lg p-2"
        onClick={() => setIsOuterCardOpen(!isOuterCardOpen)}
      >
        <h1>Card</h1>
      </div>
    </>
  );
};

export default InnerCard;
