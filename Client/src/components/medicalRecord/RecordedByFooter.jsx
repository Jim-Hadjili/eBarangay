import { memo } from "react";
import { UserCheck, Clock } from "lucide-react";
import { formatDateWithTime } from "../../utils/dateFormatter";

function RecordedByFooter({ recordedBy, recordDate, updateHistory }) {
  const formatDateTime = (date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  return (
    <div className="pt-2 sm:pt-3 mt-2 border-t border-gray-200">
      {updateHistory && updateHistory.length > 0 && (
        <div className="mb-1.5 sm:mb-2 space-y-1">
          {updateHistory.map((update, index) => {
            const { date, time } = formatDateTime(update.updatedAt);
            return (
              <div
                key={index}
                className="flex items-start gap-2 p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-xs text-gray-600 font-Lexend wrap-break-word">
                  <p>
                    Updated by:{" "}
                    <span className="font-semibold text-gray-900">
                      {update.updatedBy
                        ? `${update.updatedBy.firstName} ${update.updatedBy.lastName}`
                        : "Unknown"}
                    </span>
                  </p>
                  <p className="mt-0.5 text-gray-500">
                    {date} at {time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-start sm:items-center gap-2 p-2.5 sm:p-3 bg-green-50 rounded-lg border border-green-200">
        <UserCheck className="w-4 h-4 text-green-600 shrink-0 mt-0.5 sm:mt-0" />
        <div className="text-xs sm:text-xs text-gray-600 font-Lexend wrap-break-word">
          Recorded by:{" "}
          <span className="font-semibold text-gray-900">
            {recordedBy
              ? `${recordedBy.firstName} ${recordedBy.lastName}`
              : "Unknown"}
          </span>
          {recordDate && (
            <span className="block sm:inline sm:ml-2 text-gray-500 mt-0.5 sm:mt-0">
              {formatDateWithTime(recordDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(RecordedByFooter);
