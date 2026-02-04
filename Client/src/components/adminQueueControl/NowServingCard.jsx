import {
  Phone,
  CheckCircle,
  Users,
  User,
  Volume2,
  SkipForward,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function NowServingCard({
  currentQueue,
  patient,
  onCallClick,
  onCompleteClick,
  onSkipClick,
}) {
  const [callCount, setCallCount] = useState(0);
  const [isCallCooldown, setIsCallCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [lastCallTime, setLastCallTime] = useState(null);

  const getPriorityBadge = (priorityStatus) => {
    if (priorityStatus === "Senior Citizen") {
      return (
        <span className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full font-Lexend">
          SENIOR CITIZEN
        </span>
      );
    }
    if (priorityStatus === "PWD") {
      return (
        <span className="px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full font-Lexend">
          PWD
        </span>
      );
    }
    return null;
  };

  // Reset call count when queue changes
  useEffect(() => {
    setCallCount(0);
    setLastCallTime(null);
  }, [currentQueue?._id]);

  // Cooldown timer
  useEffect(() => {
    if (isCallCooldown && cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (cooldownTime === 0 && isCallCooldown) {
      setIsCallCooldown(false);
    }
  }, [isCallCooldown, cooldownTime]);

  const handleCallClick = async () => {
    if (isCallCooldown) return;

    await onCallClick();
    setCallCount((prev) => prev + 1);
    setLastCallTime(new Date());
    setIsCallCooldown(true);
    setCooldownTime(5); // 5 second cooldown
  };

  const formatLastCallTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm">
      <div className="px-4 py-3 sm:px-6 sm:py-4 bg-blue-200 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 font-Lexend">
          NOW SERVING
        </h2>
      </div>

      {currentQueue ? (
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-orange-500 font-Lexend">
              {currentQueue.queueCode}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3 flex-wrap">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <p className="text-base sm:text-lg font-medium text-gray-900 font-Lexend text-center">
                {patient?.firstName} {patient?.lastName}
              </p>
            </div>

            {/* Priority Badge */}
            {patient?.priorityStatus && patient.priorityStatus !== "None" && (
              <div className="flex justify-center mt-2 sm:mt-3">
                {getPriorityBadge(patient.priorityStatus)}
              </div>
            )}

            {/* Call Status */}
            {callCount > 0 && (
              <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3 text-xs sm:text-sm">
                <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                <span className="text-gray-600 font-Lexend text-center">
                  Called {callCount} {callCount === 1 ? "time" : "times"}
                  {lastCallTime && (
                    <span className="text-gray-400 ml-1">
                      ({formatLastCallTime(lastCallTime)})
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleCallClick}
              disabled={isCallCooldown}
              className={`flex items-center justify-center flex-1 gap-2 px-4 py-3 text-white transition-all rounded-lg font-Lexend font-medium ${
                isCallCooldown
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 cursor-pointer"
              }`}
            >
              <Phone className="w-5 h-5" />
              {isCallCooldown ? (
                <span>Wait {cooldownTime}s</span>
              ) : (
                <span>Call</span>
              )}
            </button>
            <button
              onClick={onSkipClick}
              className="flex cursor-pointer items-center justify-center flex-1 gap-2 px-4 py-3 text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700 font-Lexend font-medium"
            >
              <SkipForward className="w-5 h-5" />
              Skip
            </button>
            <button
              onClick={onCompleteClick}
              className="flex cursor-pointer items-center justify-center flex-1 gap-2 px-4 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 font-Lexend font-medium"
            >
              <CheckCircle className="w-5 h-5" />
              Complete
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 sm:p-12 text-center">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-sm sm:text-base text-gray-500 font-Lexend mb-4 sm:mb-6">
            No patients waiting
          </p>
          <button
            onClick={handleCallClick}
            disabled={isCallCooldown}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 mx-auto text-sm sm:text-base text-white transition-all rounded-lg font-Lexend font-medium ${
              isCallCooldown
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 cursor-pointer"
            }`}
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
            {isCallCooldown ? (
              <span>Wait {cooldownTime}s</span>
            ) : (
              <span>Call Next</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
