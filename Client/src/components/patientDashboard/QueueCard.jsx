import { useServiceQueueStatus } from "../../hooks/useServiceQueueStatus";
import { useWaitingTime } from "../../hooks/useWaitingTime";

export default function QueueCard({ userQueue, onCancel, onRefresh }) {
  // Get real-time status of currently serving queue for user's service
  const { currentlyServing, loading: statusLoading } = useServiceQueueStatus(
    userQueue?.serviceId,
  );

  // Get real-time waiting time estimates
  const { waitingTimeData, loading: waitingTimeLoading } = useWaitingTime(
    userQueue?._id,
    userQueue?.serviceId,
    userQueue?.queueCode,
  );

  // Check if it's the user's turn
  const isMyTurn =
    userQueue &&
    currentlyServing &&
    userQueue.queueNumber === currentlyServing.queueNumber;

  // Check if user is on recall list
  const isOnRecallList = userQueue?.status === "skipped";

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl lg:min-w-sm drop-shadow-md border border-gray-200 w-full max-w-sm flex flex-col">
        {userQueue ? (
          <>
            {/* Header with title and status badge */}
            <div
              className={`flex p-4 rounded-t-2xl justify-between items-center mb-6 ${
                isOnRecallList ? "bg-orange-500" : "bg-green-500"
              }`}
            >
              <span className="text-white font-bold text-lg">
                {isOnRecallList ? "Recall List" : "Current Queue"}
              </span>
              <span
                className={`font-Lexend text-white text-xs px-3 py-1 rounded-full ${
                  isOnRecallList ? "bg-orange-400" : "bg-green-400"
                }`}
              >
                {isOnRecallList ? "On Recall" : "Active"}
              </span>
            </div>

            {/* Queue Number Display */}
            <div className=" rounded-2xl  w-full flex flex-col items-center mb-6">
              <span className=" text-sm font-Lexend mb-3">
                Your Queue Number
              </span>
              <span
                className={`text-4xl font-Lexend p-5 rounded-2xl font-bold text-white tracking-wider ${
                  isOnRecallList ? "bg-orange-500" : "bg-green-500"
                }`}
              >
                {userQueue.queueCode}
              </span>
            </div>

            {/* Recall List Notice */}
            {isOnRecallList && (
              <div className="mx-6 mb-6">
                <div className="rounded-2xl p-4 border-2 bg-orange-50 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm font-semibold text-orange-700">
                        MOVED TO RECALL LIST
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-orange-200">
                    <div className="flex items-start gap-2 text-orange-700">
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs font-medium leading-relaxed">
                        Please approach the service counter to be recalled. You
                        still have your queue number.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Real-time Queue Status Indicator */}
            {!isOnRecallList && (
              <div className="mx-6 mb-6">
                <div
                  className={`rounded-2xl p-4 border-2 transition-all duration-300 ${
                    isMyTurn
                      ? "bg-green-50 border-green-500"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isMyTurn ? "bg-green-500" : "bg-blue-500"
                        }`}
                      ></div>
                      <span
                        className={`text-sm font-semibold ${
                          isMyTurn ? "text-green-700" : "text-blue-700"
                        }`}
                      >
                        {isMyTurn ? "IT'S YOUR TURN!" : "Now Serving"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-xs">
                      Current Queue Number
                    </span>
                    {statusLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        <span className="text-gray-500 text-sm">
                          Loading...
                        </span>
                      </div>
                    ) : currentlyServing ? (
                      <span
                        className={`text-xl font-bold ${
                          isMyTurn ? "text-green-600" : "text-blue-600"
                        }`}
                      >
                        {currentlyServing.queueCode}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm italic">
                        Queue not started
                      </span>
                    )}
                  </div>
                  {isMyTurn && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-medium">
                          Please proceed to the service counter
                        </span>
                      </div>
                    </div>
                  )}
                  {!isMyTurn && currentlyServing && userQueue && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Your position:</span>
                        <span className="font-semibold text-gray-700">
                          {userQueue.queueNumber > currentlyServing.queueNumber
                            ? `${userQueue.queueNumber - currentlyServing.queueNumber} patient(s) ahead`
                            : "Please check with staff"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Queue Details */}
            <div className="space-y-6 mx-6 bg-white border border-gray-200 p-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">Service</span>
                </div>
                <span className="text-gray-900 font-semibold">
                  {userQueue.serviceName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">Category</span>
                </div>
                <span className="text-gray-900 font-semibold">
                  General Check-ups
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">Est. Wait</span>
                </div>
                {waitingTimeLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                    <span className="text-gray-500 text-xs">Loading...</span>
                  </div>
                ) : waitingTimeData?.isMonitored === false ? (
                  <span className="text-gray-400 text-sm italic">
                    Not monitored
                  </span>
                ) : waitingTimeData?.status === "serving" ? (
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Now serving
                  </span>
                ) : waitingTimeData?.estimatedWaitingTime !== null &&
                  waitingTimeData?.estimatedWaitingTime !== undefined ? (
                  <div className="text-right">
                    <span className="text-green-600 font-semibold block">
                      {waitingTimeData.estimatedWaitingTimeFormatted}
                    </span>
                    {waitingTimeData.averageConsultationTime && (
                      <span className="text-xs text-gray-500">
                        ~{Math.round(waitingTimeData.averageConsultationTime)}{" "}
                        min/patient
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm italic">
                    Calculating...
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 p-6">
              <button
                onClick={onRefresh}
                disabled={!userQueue} // Disable if no active queue
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg transition font-medium cursor-pointer
    ${!userQueue ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
              <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Header with title and inactive badge */}
            <div className="flex bg-white p-4 rounded-t-2xl justify-between items-center border-b border-gray-200">
              <span className="text-gray-800 font-bold text-lg">
                Current Queue
              </span>
              <span className="bg-gray-200 font-Lexend text-gray-600 text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                Inactive
              </span>
            </div>

            {/* Empty State Content */}
            <div className="text-center py-8 px-6">
              {/* Calendar Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-2xl p-6">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                </div>
              </div>

              {/* Title and Description */}
              <h3 className="text-gray-900 font-bold text-lg mb-2">
                No Active Queue
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                You're not currently in any queue. Select a{" "}
                <span className="text-blue-600">healthcare service</span> to
                join the queue.
              </p>

              {/* Quick Tip Section */}
              <div className="bg-teal-50 rounded-xl p-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    <div className="w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold text-sm mb-1">
                      Quick Tip
                    </h4>
                    <p className="text-gray-700 text-xs leading-relaxed">
                      Browse available services and join a queue to get
                      real-time updates on your position and estimated wait
                      time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
