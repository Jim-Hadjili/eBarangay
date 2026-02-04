import { FileText } from "lucide-react";
import PatientInfoSection from "./PatientInfoSection";
import MedicalHistorySection from "./MedicalHistorySection";

export default function MedicalRecordsPanel({
  patient,
  medicalRecords,
  loadingRecords,
  onViewRecord,
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl max-h-130 md:max-h-180">
      <div className="px-4 py-3 bg-green-200 border-b border-gray-200 sm:px-6 sm:py-4">
        <h3 className="text-sm font-bold text-gray-900 sm:text-base font-Lexend">
          MEDICAL RECORDS
        </h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto sm:p-6">
        {patient ? (
          <div className="space-y-6">
            <PatientInfoSection patient={patient} />
            <MedicalHistorySection
              patient={patient}
              medicalRecords={medicalRecords}
              loadingRecords={loadingRecords}
              onViewRecord={onViewRecord}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FileText className="w-12 h-12 mb-3 text-gray-300 sm:w-16 sm:h-16" />
            <p className="mb-2 text-sm font-bold text-gray-900 sm:text-base font-Lexend">
              No Medical Records
            </p>
            <p className="text-xs text-gray-500 sm:text-sm font-Lexend">
              Select a patient to view their medical records
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
