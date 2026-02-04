import { FileText } from "lucide-react";
import MedicalRecordItem from "./MedicalRecordItem";

export default function MedicalHistorySection({
  patient,
  medicalRecords,
  loadingRecords,
  onViewRecord,
}) {
  return (
    <div className="pt-6 border-t border-gray-200">
      <h4 className="mb-3 text-sm font-semibold text-gray-700 uppercase font-Lexend">
        Medical History
      </h4>

      {loadingRecords ? (
        <div className="py-8 text-center">
          <div className="w-8 h-8 mx-auto border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-2 text-sm text-gray-500 font-Lexend">
            Loading records...
          </p>
        </div>
      ) : medicalRecords.length === 0 ? (
        <div className="py-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-Lexend">
            No medical history found for {patient.firstName} {patient.lastName}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-125 overflow-y-auto pr-2">
          {medicalRecords.map((record) => (
            <MedicalRecordItem
              key={record._id}
              record={record}
              onClick={() => onViewRecord(record)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
