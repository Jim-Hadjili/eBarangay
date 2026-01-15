import Modal from "../ui/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faHashtag,
  faCircleCheck,
  faCircleExclamation,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function QueueInfoModal({
  isOpen,
  onClose,
  selectedService,
  userQueue,
  queueData,
  onJoinQueue,
}) {
  const isQueueFull =
    queueData.limit && queueData.queue.length >= queueData.limit;
  const hasActiveQueue = !!userQueue;
  const canJoinQueue =
    !hasActiveQueue &&
    !isQueueFull &&
    queueData.nextNumber &&
    queueData.identifier;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="default">
      <div className="w-full">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl mb-3 shadow-lg">
            <FontAwesomeIcon icon={faUsers} className="text-2xl text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {selectedService?.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Queue Information</p>
        </div>

        {/* Status Messages */}
        {hasActiveQueue ? (
          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon
                icon={faCircleExclamation}
                className="text-orange-500 text-xl mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-orange-800 mb-1">
                  Active Queue Detected
                </h4>
                <p className="text-sm text-orange-700">
                  You already have an active queue for{" "}
                  <span className="font-semibold">{userQueue.serviceName}</span>{" "}
                  (<span className="font-mono">{userQueue.queueCode}</span>).
                  You cannot join another queue today.
                </p>
              </div>
            </div>
          </div>
        ) : isQueueFull ? (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon
                icon={faCircleExclamation}
                className="text-red-500 text-xl mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Queue Full</h4>
                <p className="text-sm text-red-700">
                  The queue has reached its capacity for today. Please try again
                  tomorrow.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-green-500 text-xl mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-green-800 mb-1">
                  Queue Available
                </h4>
                <p className="text-sm text-green-700">
                  You can join this queue now and secure your spot.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Queue Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-blue-600 text-sm"
              />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                In Queue
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {queueData.queue.length}
            </p>
            {queueData.limit && (
              <p className="text-xs text-gray-500 mt-1">
                of {queueData.limit} max
              </p>
            )}
          </div>

          <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon
                icon={faHashtag}
                className="text-purple-600 text-sm"
              />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Your Number
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 font-mono">
              {queueData.nextNumber && queueData.identifier
                ? `${queueData.identifier}-${String(
                    queueData.nextNumber
                  ).padStart(3, "0")}`
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all transform ${
            canJoinQueue
              ? "bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={onJoinQueue}
          disabled={!canJoinQueue}
        >
          {hasActiveQueue
            ? "Already in Queue"
            : isQueueFull
            ? "Queue Full"
            : "Join Queue"}
        </button>
      </div>
    </Modal>
  );
}
