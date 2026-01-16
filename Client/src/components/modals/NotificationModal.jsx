import Modal from "../ui/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function NotificationModal({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
}) {
  const iconMap = {
    success: faCheckCircle,
    error: faTimesCircle,
    info: faInfoCircle,
  };
  const colorMap = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-blue-500",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="default">
      <div className="w-full text-center p-4">
        <FontAwesomeIcon
          icon={iconMap[type]}
          className={`text-5xl mb-4 ${colorMap[type]}`}
        />
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-xl cursor-pointer font-semibold text-white ${
            type === "success"
              ? "bg-green-500 hover:bg-green-600"
              : type === "error"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } transition-all`}
        >
          OK
        </button>
      </div>
    </Modal>
  );
}
