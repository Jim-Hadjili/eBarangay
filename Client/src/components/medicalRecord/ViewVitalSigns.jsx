import { memo } from "react";
import { Activity } from "lucide-react";

function ViewVitalSigns({ vitalSigns }) {
  if (!vitalSigns || !Object.values(vitalSigns).some((v) => v)) {
    return null;
  }

  const vitalSignsData = [
    { label: "Blood Pressure", value: vitalSigns.bloodPressure },
    { label: "Temperature", value: vitalSigns.temperature },
    { label: "Pulse Rate", value: vitalSigns.pulseRate },
    { label: "Respiratory Rate", value: vitalSigns.respiratoryRate },
    { label: "Weight", value: vitalSigns.weight },
    { label: "Height", value: vitalSigns.height },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 sm:mb-3 pb-2 border-b border-gray-200">
        <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-100">
          <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
        </div>
        <div className="text-xs sm:text-xs font-bold text-gray-700 uppercase font-Lexend tracking-wide">
          Vital Signs
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3">
        {vitalSignsData.map(
          ({ label, value }) =>
            value && (
              <div
                key={label}
                className="p-2 sm:p-2.5 bg-blue-50 rounded-lg border border-blue-100"
              >
                <div className="text-xs text-gray-600 font-Lexend mb-0.5 sm:mb-1">
                  {label}
                </div>
                <div className="text-sm sm:text-base font-bold text-gray-900 break-words">
                  {value}
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}

export default memo(ViewVitalSigns);
