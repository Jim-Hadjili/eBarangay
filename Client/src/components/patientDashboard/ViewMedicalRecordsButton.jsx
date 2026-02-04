import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileMedical } from "@fortawesome/free-solid-svg-icons";

export default function ViewMedicalRecordsButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/medical-history");
  };

  return (
    <button
      onClick={handleClick}
      className="group cursor-pointer relative flex flex-col items-start max-h-80 justify-between w-full gap-3 p-6 text-left transition-all duration-200 bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-green-400 hover:-translate-y-0.5 rounded-2xl overflow-hidden"
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 transition-opacity duration-200 opacity-0 bg-linear-to-br from-green-50 to-transparent group-hover:opacity-100" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col w-full gap-3">
        {/* Icon */}
        <div className="p-3 text-white transition-all duration-200 bg-green-500 shadow-sm rounded-xl group-hover:bg-green-600 group-hover:shadow-md shrink-0 w-fit">
          <FontAwesomeIcon icon={faFileMedical} size="xl" />
        </div>

        {/* Text content */}
        <div className="flex flex-col gap-2 mb-5">
          <h3 className="text-lg font-semibold text-gray-800 transition-colors group-hover:text-green-600">
            Medical Records
          </h3>
          <p className="text-sm text-gray-500 transition-colors group-hover:text-gray-600">
            View all your medical history and documents
          </p>
        </div>
      </div>

      {/* Arrow indicator - always visible on mobile, appears on hover for desktop */}
      <div className="relative z-10 flex items-center text-sm font-medium text-green-600 transition-all duration-200 transform md:opacity-0 md:group-hover:opacity-100 group-hover:translate-x-1">
        View Records
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
}
