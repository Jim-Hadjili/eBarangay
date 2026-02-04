import { memo, useCallback } from "react";
import Modal from "../ui/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faExclamationTriangle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

function SkippedModal({ isOpen, onClose, queueInfo }) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="default">
      <div className="w-full text-center">
        {/* Animated Icon */}
        <div className="mb-5 relative">
          <div className="mx-auto w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <FontAwesomeIcon
              icon={faClockRotateLeft}
              className="text-3xl text-white"
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold text-gray-900 mb-3 font-Lexend">
          <span className="bg-orange-500 bg-clip-text text-transparent">
            You Have Been Moved to Recall List
          </span>
        </h3>

        {/* Subtitle */}
        <p className="text-gray-600 mb-5 text-base font-Lexend">
          Your turn was called but you did not respond in time
        </p>

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 text-left">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-blue-500 text-lg mt-0.5 shrink-0"
            />
            <div>
              <p className="text-sm text-gray-700 font-Lexend leading-relaxed">
                <strong className="text-blue-700">What happens now?</strong>
                <br />
                Your queue number <strong>{queueInfo?.queueCode}</strong> has
                been moved to the Recall List. You still have your queue number
                and don't need to take a new one. Please approach the service
                counter to be recalled and continue with your consultation.
              </p>
            </div>
          </div>
        </div>

        {/* Warning Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-left">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-amber-500 text-lg mt-0.5 shrink-0"
            />
            <div>
              <p className="text-sm text-gray-700 font-Lexend leading-relaxed">
                <strong className="text-amber-700">Important:</strong>
                <br />
                Please approach the counter as soon as possible. The staff will
                recall you from the Recall List when you're ready. Make sure to
                be present when recalled to avoid further delays.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleClose}
          className="w-full py-3.5 cursor-pointer bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition-colors"
        >
          I Understand
        </button>
      </div>
    </Modal>
  );
}

export default memo(SkippedModal);
