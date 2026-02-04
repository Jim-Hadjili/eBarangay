import { memo } from "react";
import { FileText, Calendar } from "lucide-react";
import { formatDateWithTime } from "../../utils/dateFormatter";

function ViewModalHeader({ serviceName, visitDate }) {
  return (
    <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg shrink-0">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-Lexend">
            Medical Record
          </h3>
          <div className="flex items-start sm:items-center gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-xs sm:text-sm font-medium text-gray-600 font-Lexend break-words">
              {serviceName || "Unknown Service"} •{" "}
              {formatDateWithTime(visitDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ViewModalHeader);
