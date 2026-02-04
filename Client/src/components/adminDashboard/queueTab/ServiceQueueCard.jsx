import { Users, Clock, AlertCircle, Lock } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServiceIcon } from "../../../utils/serviceIcons";

export default function ServiceQueueCard({ service, onClick }) {
  const isUnavailable = service.status === "unavailable";
  const isLimitReached =
    service.queueLimit !== null && service.waitingCount >= service.queueLimit;
  const isMonitored = service.isMonitored;

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden transition-all duration-200 bg-white border border-gray-200 cursor-pointer rounded-xl hover:shadow-lg hover:scale-105"
    >
      <div className="absolute top-4 right-4">
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            isUnavailable
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isUnavailable ? "bg-red-500" : "bg-green-500 animate-pulse"
            }`}
          ></div>
          <span className="font-Lexend">
            {isUnavailable ? "Unavailable" : "Active"}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
              <FontAwesomeIcon
                icon={getServiceIcon(service)}
                className="text-lg text-blue-600"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-Lexend">
              {service.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 font-Lexend">
            {service.description}
          </p>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600 font-Lexend">
                Waiting
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600 font-Lexend">
                {service.waitingCount}
              </span>
              {service.queueLimit !== null && (
                <span className="text-sm text-gray-500 font-Lexend">
                  / {service.queueLimit}
                </span>
              )}
            </div>
          </div>
          {isLimitReached && (
            <div className="flex items-center gap-2 p-2 mt-3 rounded-lg bg-amber-50">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700 font-Lexend">
                Queue limit reached
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="text-xs text-gray-600 font-Lexend">Next</div>
              <div className="mt-1 text-lg font-bold text-gray-900 font-Lexend">
                {service.identifier}-
                {String(service.nextQueueNumber).padStart(3, "0")}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-gray-50">
              <div className="text-xs text-gray-600 font-Lexend">Last</div>
              <div className="mt-1 text-lg font-bold text-gray-900 font-Lexend">
                {service.identifier}-
                {String(service.lastQueueNumber).padStart(3, "0")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex items-center justify-center gap-2 py-2 ${
          isMonitored
            ? "bg-linear-to-r from-orange-50 to-orange-100"
            : "bg-linear-to-r from-blue-50 to-blue-100"
        }`}
      >
        {isMonitored ? (
          <>
            <Lock className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-medium text-orange-700 font-Lexend">
              Monitored by {service.monitoredBy}
            </span>
          </>
        ) : (
          <>
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-700 font-Lexend">
              Click to monitor
            </span>
          </>
        )}
      </div>
    </div>
  );
}
