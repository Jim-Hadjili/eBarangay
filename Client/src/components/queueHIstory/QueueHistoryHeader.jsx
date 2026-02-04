import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function QueueHistoryHeader({ onBack }) {
  return (
    <>
      <button
        onClick={onBack}
        className="flex items-center mb-4 sm:mb-4 justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 lg:py-3 text-sm sm:text-base text-gray-600 transition-all duration-200 bg-gray-100 border-2 border-gray-400 cursor-pointer group rounded-lg sm:rounded-xl hover:shadow-lg hover:bg-gray-200 font-Lexend whitespace-nowrap"
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="sm:w-5 sm:h-5 transition-transform duration-200 group-hover:-translate-x-1"
        />
        <span className="hidden md:inline">Back to Dashboard</span>
        <span className="md:hidden">Back</span>
      </button>

      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-Lexend text-gray-900 mb-1.5 sm:mb-2">
          Queue History
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          View your past appointments and service interactions
        </p>
      </div>
    </>
  );
}
