import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { calculateEstimatedTime } from "../../utils/queueDisplayHelpers";

const getPriorityBadge = (priorityStatus) => {
  if (priorityStatus === "Senior Citizen") {
    return (
      <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-purple-700 bg-purple-100 rounded-full shrink-0">
        Senior
      </span>
    );
  }
  if (priorityStatus === "PWD") {
    return (
      <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-orange-700 bg-orange-100 rounded-full shrink-0">
        PWD
      </span>
    );
  }
  return null;
};

const getPriorityBorderClass = (priorityStatus) => {
  if (priorityStatus === "Senior Citizen") {
    return "border-l-2 sm:border-l-4 border-purple-500 bg-purple-50";
  }
  if (priorityStatus === "PWD") {
    return "border-l-2 sm:border-l-4 border-orange-500 bg-orange-50";
  }
  return "bg-gray-100 hover:bg-gray-200";
};

export default function QueueItem({ queue, index }) {
  return (
    <div
      className={`rounded-lg sm:rounded-xl py-2.5 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-5 flex justify-between items-center gap-2 transition-all hover:translate-x-1 ${
        queue.isUrgent
          ? "bg-linear-to-r from-red-50 to-red-100 border-l-2 sm:border-l-4 border-red-600"
          : getPriorityBorderClass(queue.priorityStatus)
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
        <span
          className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${
            queue.isUrgent
              ? "bg-red-200 text-red-800"
              : "bg-green-500 text-white"
          }`}
        >
          {index + 1}
        </span>
        <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 tracking-wide truncate">
          {queue.queueCode}
        </span>
        {queue.isUrgent && (
          <span className="inline-flex items-center gap-1 bg-red-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide shrink-0">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-[8px] sm:text-[10px]"
            />
            <span className="hidden sm:inline">Urgent</span>
            <span className="sm:hidden">!</span>
          </span>
        )}
      </div>
      {queue.priorityStatus && queue.priorityStatus !== "None" && (
        <div className="shrink-0">{getPriorityBadge(queue.priorityStatus)}</div>
      )}
      {/* <div className="text-right shrink-0">
        <span className="block text-[10px] sm:text-xs text-gray-500 font-medium mb-0.5">
          Est. Time
        </span>
        <span className="block text-xs sm:text-sm font-bold text-gray-700">
          {calculateEstimatedTime(index + 1)}
        </span>
      </div> */}
    </div>
  );
}
