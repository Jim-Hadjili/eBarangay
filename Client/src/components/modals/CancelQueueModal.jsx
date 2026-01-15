import Modal from "../ui/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faInfoCircle,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function CancelQueueModal({
  isOpen,
  onClose,
  onConfirm,
  queueInfo,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="default">
      <div className="w-full">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-red-500 to-orange-500 rounded-2xl mb-3 shadow-lg">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="text-3xl text-white"
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Cancel Your Queue?
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            This action requires confirmation
          </p>
        </div>

        {/* Queue Information Card */}
        <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 mb-6 border border-gray-200">
          <p className="text-gray-700 text-center mb-3">
            You are about to cancel your queue
          </p>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Queue Number
              </span>
              <span className="text-lg font-bold font-mono text-gray-900">
                {queueInfo?.queueCode}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Service
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {queueInfo?.serviceName}
              </span>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="text-amber-600 text-sm"
                />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-2">
                Important Notice
              </h4>
              <ul className="space-y-2.5">
                {queueInfo?.isLimitReached ? (
                  <li className="flex items-start gap-2 text-sm text-amber-800">
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="text-red-600 mt-0.5 shrink-0"
                    />
                    <span>
                      The queue limit has been reached (
                      <span className="font-mono font-semibold">
                        {queueInfo.currentCount}/{queueInfo.queueLimit}
                      </span>
                      ).{" "}
                      <span className="font-semibold text-red-700">
                        You will NOT be able to book again today
                      </span>{" "}
                      after canceling.
                    </span>
                  </li>
                ) : (
                  <li className="flex items-start gap-2 text-sm text-amber-800">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="text-amber-600 mt-0.5 shrink-0"
                    />
                    <span>
                      If you book again today, you will be placed at the{" "}
                      <span className="font-semibold">last position</span> in
                      the queue.
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            Keep Queue
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-linear-to-r from-red-600 to-red-500 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-600 hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <FontAwesomeIcon icon={faXmark} className="mr-2" />
            Cancel Queue
          </button>
        </div>
      </div>
    </Modal>
  );
}
