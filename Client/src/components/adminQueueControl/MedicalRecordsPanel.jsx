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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-green-200 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 font-Lexend">MEDICAL RECORDS</h3>
      </div>

      <div className="p-6">
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
          <div className="py-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="font-bold text-gray-900 font-Lexend mb-2">
              No Medical Records
            </p>
            <p className="text-sm text-gray-500 font-Lexend">
              Select a patient to view their medical records
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
