import Modal from "../ui/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faHashtag,
  faCircleCheck,
  faCircleExclamation,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

export default function QueueInfoModal({
  isOpen,
  onClose,
  selectedService,
  userQueue,
  queueData,
  onJoinQueue,
  isJoining = false, // Add this prop
}) {
  const isQueueFull =
    queueData.limit !== null &&
    queueData.limit !== undefined &&
    queueData.queue.length >= queueData.limit;
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
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center mb-3 shadow-lg w-14 h-14 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl">
            <FontAwesomeIcon icon={faUsers} className="text-2xl text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {selectedService?.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">Queue Information</p>
        </div>

        {/* Status Messages */}
        {hasActiveQueue ? (
          <div className="p-4 mb-6 border-l-4 border-orange-500 rounded-lg bg-orange-50">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon
                icon={faCircleExclamation}
                className="text-orange-500 text-xl mt-0.5"
              />
              <div>
                <h4 className="mb-1 font-semibold text-orange-800">
                  Active Queue Detected
                </h4>
                <p className="text-sm text-orange-700">
                  You already have an active queue for{" "}
                  <span className="font-semibold">{userQueue.serviceName}</span>{" "}
                  You cannot join another queue.
                </p>
              </div>
            </div>
          </div>
        ) : isQueueFull ? (
          <div className="p-4 mb-6 border-l-4 border-red-500 rounded-lg bg-red-50">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon
                icon={faCircleExclamation}
                className="text-red-500 text-xl mt-0.5"
              />
              <div>
                <h4 className="mb-1 font-semibold text-red-800">Queue Full</h4>
                <p className="text-sm text-red-700">
                  The queue has reached its capacity for today. Please try again
                  tomorrow.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 mb-6 border-l-4 border-green-500 rounded-lg bg-green-50">
            <div className="flex items-start gap-3">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-green-500 text-xl mt-0.5"
              />
              <div>
                <h4 className="mb-1 font-semibold text-green-800">
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
          <div className="p-4 border-2 border-blue-100 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-sm text-blue-600"
              />
              <span className="text-xs font-medium tracking-wide text-gray-600 uppercase">
                In Queue
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {queueData.queue.length}
            </p>
            {queueData.limit !== null && queueData.limit !== undefined && (
              <p className="mt-1 text-xs text-gray-500">
                of {queueData.limit} max
              </p>
            )}
          </div>

          <div className="p-4 border-2 border-purple-100 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon
                icon={faHashtag}
                className="text-sm text-purple-600"
              />
              <span className="text-xs font-medium tracking-wide text-gray-600 uppercase">
                Your Number
              </span>
            </div>
            <p className="font-mono text-2xl font-bold text-gray-900">
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
          className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all ${
            canJoinQueue && !isJoining
              ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg cursor-pointer"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={onJoinQueue}
          disabled={!canJoinQueue || isJoining}
        >
          {isJoining ? (
            <span className="flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              Joining Queue...
            </span>
          ) : hasActiveQueue ? (
            "Already in Queue"
          ) : isQueueFull ? (
            "Queue Full"
          ) : (
            "Join Queue"
          )}
        </button>
      </div>
    </Modal>
  );
}
