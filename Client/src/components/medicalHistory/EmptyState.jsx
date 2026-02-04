import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileMedical } from "@fortawesome/free-solid-svg-icons";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="p-6 bg-gray-100 rounded-full mb-4">
        <FontAwesomeIcon
          icon={faFileMedical}
          className="text-gray-400"
          size="3x"
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Medical Records Yet
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        Your medical history will appear here once you've had consultations at
        the health center.
      </p>
    </div>
  );
}
