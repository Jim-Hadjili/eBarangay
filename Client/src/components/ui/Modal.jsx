import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import reactDom from "react-dom";

export default function Modal({ isOpen, onClose, children, size = "default" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    default: "max-w-md",
    large: "max-w-3xl",
  };

  return reactDom.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-xs bg-black/50 sm:p-6">
      <div
        className={`relative flex flex-col items-end justify-center w-full ${sizeClasses[size]} gap-4 p-4 bg-white sm:gap-6 sm:p-6 rounded-2xl max-h-[90vh] overflow-y-auto`}
      >
        <button
          onClick={onClose}
          className="absolute px-2 py-1 rounded-full cursor-pointer top-2 right-2 hover:bg-gray-200"
        >
          <FontAwesomeIcon icon={faXmark} className="text-sm text-gray-700" />
        </button>

        {children}
      </div>
    </div>,

    document.getElementById("modal-root")
  );
}
