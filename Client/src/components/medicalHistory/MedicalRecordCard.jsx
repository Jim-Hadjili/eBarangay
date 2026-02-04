import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faUserDoctor,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { getServiceIcon } from "../../utils/serviceIcons";
import { formatDateWithTime } from "../../utils/dateFormatter";

export default function MedicalRecordCard({ record }) {
  const navigate = useNavigate();

  const serviceName = record.service?.name || "Unknown Service";
  const serviceIcon = getServiceIcon(record.service);
  const recordedByName = record.recordedBy
    ? `${record.recordedBy.firstName} ${record.recordedBy.lastName}`
    : "Unknown";

  const handleViewDetails = () => {
    navigate(`/medical-record/${record._id}`);
  };

  return (
    <div className="group relative flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:border-green-400 transition-all duration-200 rounded-xl sm:rounded-2xl overflow-hidden">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 transition-opacity duration-200 opacity-0 bg-linear-to-br from-green-50 to-transparent group-hover:opacity-100" />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
        {/* Header section with service icon and name */}
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 text-white bg-green-500 shadow-sm rounded-lg sm:rounded-xl shrink-0">
              <FontAwesomeIcon
                icon={serviceIcon}
                size="lg"
                className="text-base sm:text-lg"
              />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">
                {serviceName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs sm:text-sm text-gray-500">
                <FontAwesomeIcon icon={faCalendar} className="text-xs" />
                <span className="truncate">
                  {formatDateWithTime(record.visitDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details section */}
        <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-sm">
          {/* Chief Complaint */}
          {record.chiefComplaint && (
            <div className="flex flex-col gap-1">
              <span className="font-medium text-gray-700">
                Chief Complaint:
              </span>
              <span className="text-gray-600 pl-2 line-clamp-2">
                {record.chiefComplaint}
              </span>
            </div>
          )}

          {/* Diagnosis */}
          {record.diagnosis && (
            <div className="flex flex-col gap-1">
              <span className="font-medium text-gray-700">Diagnosis:</span>
              <span className="text-gray-600 pl-2 line-clamp-2">
                {record.diagnosis}
              </span>
            </div>
          )}
        </div>

        {/* Footer section */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-500 min-w-0 flex-1">
            <FontAwesomeIcon icon={faUserDoctor} className="shrink-0" />
            <span className="truncate">Recorded by: {recordedByName}</span>
          </div>
          <button
            onClick={handleViewDetails}
            className="flex items-center cursor-pointer justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200 shrink-0"
          >
            <FontAwesomeIcon icon={faEye} />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
          </button>
        </div>
      </div>
    </div>
  );
}
