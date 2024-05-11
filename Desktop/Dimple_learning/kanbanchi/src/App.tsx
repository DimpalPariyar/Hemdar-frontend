import { ToDoCard } from "./components/cards/ToDoCard";
import { DoingCard } from "./components/cards/DoingCard";
import { DoneCard } from "./components/cards/DoneCard";
import { useState } from "react";
import { OpenInnerCard } from "./components/innerCards/OpenInnerCard";
// import { OpenInnerCard } from "./components/innerCards/OpenInnerCard";

function App() {
  const [isOuterCardOpen, setIsOuterCardOpen] = useState(false);

  function handleClose() {
    setIsOuterCardOpen(false);
  }

  return (
    <div
      className=" bg-cover bg-center h-screen"
      style={{ backgroundImage: "url('/public/cloud.jpg')" }}
    >
      <OpenInnerCard isOpen={isOuterCardOpen} onClose={handleClose} />
      <h1 className="text-3xl font-bold text-center">Kanbanchi</h1>
      <div className="flex m-4">
        <ToDoCard
          isOuterCardOpen={isOuterCardOpen}
          setIsOuterCardOpen={setIsOuterCardOpen}
        />
        <DoingCard
          isOuterCardOpen={isOuterCardOpen}
          setIsOuterCardOpen={setIsOuterCardOpen}
        />
        <DoneCard
          isOuterCardOpen={isOuterCardOpen}
          setIsOuterCardOpen={setIsOuterCardOpen}
        />
      </div>
    </div>
  );
}

export default App;
