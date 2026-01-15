export default function QueueCard({ userQueue, onCancel }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gray-600 rounded-2xl p-8 shadow w-full max-w-sm h-96 flex flex-col items-center justify-center">
        {userQueue ? (
          <>
            <div className="flex justify-between w-full mb-2">
              <span className="text-white font-bold text-lg">
                Current Queue
              </span>
              <span className="border-2 border-green-400 text-green-400 font-bold text-xs px-3 py-1 rounded-full">
                Active
              </span>
            </div>
            <div className="bg-gray-500 rounded-xl p-6 w-full flex flex-col items-center mb-4">
              <span className="text-white text-sm mb-2">Your Queue Number</span>
              <span className="text-4xl font-bold text-white tracking-widest mb-2">
                {userQueue.queueCode}
              </span>
              <div className="w-full text-white text-sm mt-2">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-semibold">{userQueue.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Queue #:</span>
                  <span className="font-semibold">{userQueue.queueNumber}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span className="text-white text-xs">Queue is active</span>
            </div>
          </>
        ) : (
          <div className="text-center text-white">
            <p className="text-lg font-semibold mb-2">No Active Queue</p>
            <p className="text-sm opacity-80">
              Select a service to join the queue
            </p>
          </div>
        )}
      </div>

      {/* Cancel Button */}
      {userQueue && (
        <button
          onClick={onCancel}
          className="w-full max-w-sm px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium"
        >
          Cancel Queue
        </button>
      )}
    </div>
  );
}
