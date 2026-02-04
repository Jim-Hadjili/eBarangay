import { FileText } from "lucide-react";

export default function MedicalRecordItem({ record, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full p-2.5 sm:p-3 text-left transition-all border cursor-pointer border-green-200 rounded-lg bg-green-100 hover:bg-green-200 hover:border-green-300"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white shadow flex-shrink-0">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-semibold text-gray-900 font-Lexend truncate">
            {record.service?.name || "Unknown Service"}
          </div>
          <div className="text-xs text-gray-500 font-Lexend">
            {new Date(record.visitDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
        <div className="text-green-600 flex-shrink-0">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
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
      </div>
    </button>
  );
}
