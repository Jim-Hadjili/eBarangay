import { memo } from "react";
import { FileText, AlertCircle } from "lucide-react";

function ModalHeader({ patient, actionType, showAlert = true }) {
  return (
    <div className="mb-4 pb-4 border-b border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 font-Lexend">
            Medical Record Entry
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <p className="text-sm font-medium text-gray-600 font-Lexend">
              {patient?.firstName} {patient?.lastName}
            </p>
          </div>
        </div>
      </div>
      {showAlert && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 font-medium font-Lexend leading-relaxed">
            Please complete the medical record before{" "}
            {actionType === "call"
              ? "calling the next patient"
              : "completing this consultation"}
            .
          </p>
        </div>
      )}
    </div>
  );
}

export default memo(ModalHeader);
