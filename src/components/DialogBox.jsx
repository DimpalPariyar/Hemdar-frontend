import { useRef, useEffect } from "react";

const DialogBox = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef(null);

  // Close dialog when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] overflow-auto bg-[#999999] bg-opacity-50 flex">
      <div ref={dialogRef}>{children}</div>
    </div>
  );
};

export default DialogBox;
