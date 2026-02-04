import QueueItem from "./QueueItem";

export default function NextInQueueSection({ upcomingQueues }) {
  return (
    <div className="py-3 sm:py-4 lg:py-5 px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6">
      <div className="flex items-center gap-1.5 sm:gap-2 text-teal-700 font-bold text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 tracking-wide">
        <span className="text-base sm:text-lg font-bold">→</span>
        <span>NEXT IN QUEUE</span>
      </div>
      <div className="flex flex-col gap-2 sm:gap-2.5 lg:gap-3">
        {upcomingQueues && upcomingQueues.length > 0 ? (
          upcomingQueues
            .slice(0, 5)
            .map((queue, index) => (
              <QueueItem key={queue._id} queue={queue} index={index} />
            ))
        ) : (
          <div className="text-center py-4 sm:py-6 lg:py-8 text-gray-400 text-xs sm:text-sm italic">
            No patients waiting
          </div>
        )}
      </div>
    </div>
  );
}
