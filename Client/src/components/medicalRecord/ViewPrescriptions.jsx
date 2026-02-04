import { memo } from "react";
import { Pill } from "lucide-react";

function ViewPrescriptions({ prescriptions }) {
  if (!prescriptions || prescriptions.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 sm:mb-3 pb-2 border-b border-gray-200">
        <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-100">
          <Pill className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
        </div>
        <div className="text-xs sm:text-xs font-bold text-gray-700 uppercase font-Lexend tracking-wide">
          Prescriptions
        </div>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        {prescriptions.map((prescription, index) => (
          <div
            key={index}
            className="flex items-start gap-2 sm:gap-3 p-2 sm:p-2.5 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="shrink-0 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
              {index + 1}
            </div>
            <span className="flex-1 text-sm sm:text-base text-gray-900 font-medium pt-0.5 break-words">
              {prescription}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ViewPrescriptions);
