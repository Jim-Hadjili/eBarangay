import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStatusConfig } from "../../utils/queueStatusConfig.jsx";
import { formatRelativeDate } from "../../utils/dateFormatter";
import { getServiceIcon } from "../../utils/serviceIcons";

export default function QueueHistoryItem({ queue }) {
  const statusConfig = getStatusConfig(queue.status);
  const isCompleted = queue.status === "completed";
  const isCancelled = queue.status === "cancelled";
  const isSkipped = queue.status === "skipped";
  const serviceIcon = getServiceIcon(queue.service);

  return (
    <div className="relative pl-6 sm:pl-8 pb-4 sm:pb-6 last:pb-0">
      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-5 sm:top-7 w-3 h-3 rounded-full border-2 bg-white ${
          isCompleted
            ? "border-green-500"
            : isCancelled
              ? "border-red-500"
              : isSkipped
                ? "border-orange-500"
                : "border-amber-500"
        }`}
      ></div>

      {/* Card */}
      <div className="bg-white border-2 border-gray-300 rounded-lg sm:rounded-xl hover:shadow-sm transition-shadow duration-200">
        <div className="p-3 sm:p-4 lg:p-5">
          {/* Mobile: Icon and Status Badge in one row */}
          <div className="flex items-center justify-between mb-3 sm:hidden">
            <div className="shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={serviceIcon}
                className="w-5 h-5 text-white"
              />
            </div>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusConfig.badge}`}
            >
              {statusConfig.icon && (
                <span className="text-xs">{statusConfig.icon}</span>
              )}
              <span className="capitalize">{queue.status}</span>
            </div>
          </div>

          {/* Mobile Layout - Keep existing */}
          <div className="flex flex-col sm:hidden">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-Lexend text-gray-900 mb-1.5 truncate">
                {queue.service?.name || "Unknown Service"}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                {/* Queue Code */}
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className="font-Lexend">{queue.queueCode}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="truncate">
                    {formatRelativeDate(queue.createdAt)}
                  </span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    {new Date(queue.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tablet and Desktop Layout */}
          <div className="hidden sm:block">
            {/* Top row: Service Name and Status Badge */}
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-lg lg:text-xl font-Lexend text-gray-900 truncate flex-1">
                {queue.service?.name || "Unknown Service"}
              </h3>
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${statusConfig.badge}`}
              >
                {statusConfig.icon && (
                  <span className="text-xs">{statusConfig.icon}</span>
                )}
                <span className="capitalize">{queue.status}</span>
              </div>
            </div>

            {/* Content row with icon and details */}
            <div className="flex items-start gap-5">
              {/* Service Icon */}
              <div className="shrink-0">
                <div className="flex items-center justify-center w-16 h-16  bg-green-500 rounded-2xl">
                  <FontAwesomeIcon
                    icon={serviceIcon}
                    className="text-2xl lg:text-3xl text-white"
                  />
                </div>
              </div>

              {/* Content - Stacked vertically */}
              <div className="flex-1 min-w-0 space-y-2 lg:space-y-2.5">
                {/* Queue Code */}
                <div className="flex items-center gap-2 ">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className="text-base lg:text-lg font-Lexend text-gray-700">
                    {queue.queueCode}
                  </span>
                </div>

                {/* Date and Time */}
                <div className="flex items-center gap-4 text-sm lg:text-base text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatRelativeDate(queue.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {new Date(queue.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
