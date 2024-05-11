import React, { useRef, useEffect } from "react";

interface DialogBoxProps {
  isOpen: boolean;
  //   onClose: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  children: React.ReactNode;
}

const DialogBox: React.FC<DialogBoxProps> = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close dialog when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
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
    <div className="fixed inset-0 z-[10000] overflow-auto bg-opacity-50">
      <div ref={dialogRef}>{children}</div>
    </div>
  );
};

export default DialogBox;
