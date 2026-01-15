import Modal from "../ui/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faArrowRight,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function YourTurnModal({ isOpen, onClose, userQueue }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="default">
      <div className="w-full text-center">
        {/* Animated Icon */}
        <div className="mb-6 relative">
          <div className="mx-auto w-20 h-20 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <FontAwesomeIcon
              icon={faBell}
              className="text-3xl text-white animate-bounce"
            />
          </div>
          {/* Success Badge */}
          <div className="absolute top-0 right-1/2 translate-x-16 bg-green-500 rounded-full p-2 shadow-lg">
            <FontAwesomeIcon icon={faCheck} className="text-white text-sm" />
          </div>
          {/* Decorative Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-green-200 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold text-gray-900 mb-3 bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text">
          It's Your Turn!
        </h3>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6 text-base">
          Please proceed to the service counter
        </p>

        {/* Service Information Card */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-200 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Service
            </p>
            <p className="text-xl font-bold text-gray-900">
              {userQueue?.serviceName}
            </p>
          </div>

          <div className="h-px bg-green-200 mb-4"></div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Your Queue Number
            </p>
            <div className="inline-flex items-center justify-center bg-linear-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-md">
              <span className="text-3xl font-bold font-mono tracking-wider">
                {userQueue?.queueCode}
              </span>
            </div>
          </div>
        </div>

        {/* Direction Indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-blue-700">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-sm animate-pulse"
            />
            <p className="text-sm font-medium">
              Please bring a valid ID and necessary documents
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
        >
          <FontAwesomeIcon icon={faCheck} className="mr-2" />
          Got it!
        </button>
      </div>
    </Modal>
  );
}
