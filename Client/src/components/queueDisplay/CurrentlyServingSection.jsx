import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";

const getPriorityBadge = (priorityStatus) => {
  if (priorityStatus === "Senior Citizen") {
    return (
      <div className="flex justify-center mt-2">
        <span className="inline-flex items-center px-3 py-1 text-xs sm:text-sm font-semibold text-purple-700 bg-purple-100 rounded-full">
          Senior Citizen - Priority
        </span>
      </div>
    );
  }
  if (priorityStatus === "PWD") {
    return (
      <div className="flex justify-center mt-2">
        <span className="inline-flex items-center px-3 py-1 text-xs sm:text-sm font-semibold text-orange-700 bg-orange-100 rounded-full">
          PWD - Priority
        </span>
      </div>
    );
  }
  return null;
};

export default function CurrentlyServingSection({ currentlyServing }) {
  return (
    <div className="bg-orange-100 py-3 sm:py-4 lg:py-5 px-4 sm:px-5 lg:px-6">
      <div className="flex items-center gap-1.5 sm:gap-2 text-orange-700 font-bold text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 tracking-wide">
        <FontAwesomeIcon icon={faBullhorn} className="text-sm sm:text-base" />
        <span>NOW SERVING</span>
      </div>
      <div className="bg-white rounded-lg sm:rounded-xl py-4 sm:py-5 lg:py-6 text-center shadow-md">
        <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-orange-600 tracking-wider">
          {currentlyServing?.queueCode || "---"}
        </div>
        {currentlyServing?.priorityStatus &&
          getPriorityBadge(currentlyServing.priorityStatus)}
      </div>
    </div>
  );
}
