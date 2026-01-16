export default function QueueCard({ userQueue, onCancel, onRefresh }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl lg:min-w-sm drop-shadow-md border border-gray-200 w-full max-w-sm flex flex-col">
        {userQueue ? (
          <>
            {/* Header with title and status badge */}
            <div className="flex bg-green-500 p-4 rounded-t-2xl justify-between items-center mb-6">
              <span className="text-white font-bold text-lg">
                Current Queue
              </span>
              <span className="bg-green-400 font-Lexend text-white text-xs px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            {/* Queue Number Display */}
            <div className=" rounded-2xl  w-full flex flex-col items-center mb-6">
              <span className=" text-sm font-Lexend mb-3">
                Your Queue Number
              </span>
              <span className="text-4xl font-Lexend p-5 rounded-2xl bg-green-500 font-bold text-white tracking-wider">
                {userQueue.queueCode}
              </span>
            </div>

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
                <span className="text-green-500 font-semibold">25 mins</span>
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
          <div className="text-center text-gray-500 py-12">
            <p className="text-lg font-semibold mb-2">No Active Queue</p>
            <p className="text-sm opacity-80">
              Select a service to join the queue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
