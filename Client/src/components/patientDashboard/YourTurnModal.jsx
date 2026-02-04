import { memo, useCallback } from "react";
import Modal from "../ui/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faArrowRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

function YourTurnModal({ isOpen, onClose, userQueue }) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="default">
      <div className="w-full text-center">
        {/* Animated Icon */}
        <div className="mb-5 relative">
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faBell} className="text-3xl text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold text-gray-900 mb-3 font-Lexend">
          <span className="bg-green-500 bg-clip-text text-transparent">
            It's Your Turn!
          </span>
        </h3>

        {/* Subtitle */}
        <p className="text-gray-600 mb-5 text-base font-Lexend">
          Please proceed to the service counter
        </p>

        {/* Service Information Card */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-5 mb-5 border-2 border-green-200 shadow-sm">
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 font-Lexend">
              Service
            </p>
            <p className="text-xl font-bold text-gray-900 font-Lexend">
              {userQueue?.serviceName}
            </p>
          </div>

          <div className="h-px bg-green-200 mb-3"></div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 font-Lexend">
              Your Queue Number
            </p>
            <div className="inline-flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-xl shadow-md">
              <span className="text-3xl font-bold font-mono tracking-wider">
                {userQueue?.queueCode}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleClose}
          className="w-full py-3.5 cursor-pointer bg-green-500 text-white rounded-xl font-bold text-base hover:bg-green-600"
        >
          Got it!
          <FontAwesomeIcon icon={faCheck} className="ml-2" />
        </button>
      </div>
    </Modal>
  );
}

export default memo(YourTurnModal);
