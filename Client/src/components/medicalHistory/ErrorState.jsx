import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="p-6 bg-red-50 rounded-full mb-4">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-red-500"
          size="3x"
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Unable to Load Records
      </h3>
      <p className="text-gray-500 text-center max-w-md mb-4">
        {message ||
          "Something went wrong while loading your medical records. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
