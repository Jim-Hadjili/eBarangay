import { useState } from "react";
import Modal from "../ui/Modal";
import { FileText, Plus, X, Eye, Edit } from "lucide-react";

export default function PatientMedicalHistoryModal({
  isOpen,
  onClose,
  patient,
  records,
  loading,
  onAddRecord,
  onViewRecord,
  onEditRecord,
}) {
  if (!patient) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="w-full">
        {/* Header */}
        <div className="pb-4 mb-4 border-b border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-Lexend">
                  Medical History
                </h2>
                <p className="text-sm text-gray-600 font-Lexend">
                  {patient.name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 font-Lexend">
            <span>Email: {patient.email}</span>
            <span>•</span>
            <span>Phone: {patient.phone}</span>
          </div>
        </div>

        {/* Add New Record Button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={onAddRecord}
            className="flex items-center justify-center gap-2 px-5 py-3 text-green-600 transition-all duration-200 bg-green-100 border-2 border-green-400 cursor-pointer group rounded-xl hover:shadow-lg hover:bg-green-200 font-Lexend whitespace-nowrap"
          >
            <Plus
              size={20}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:rotate-90"
            />
            <span className="text-sm sm:text-base">Add New Record</span>
          </button>
        </div>

        {/* Records List */}
        <div className="max-h-[calc(80vh-280px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                <p className="text-sm text-gray-600 font-Lexend">
                  Loading medical records...
                </p>
              </div>
            </div>
          ) : records.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 font-Lexend">
                No Medical Records Yet
              </h3>
              <p className="mb-4 text-sm text-gray-600 font-Lexend">
                This patient doesn't have any medical records yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record._id}
                  className="p-4 transition-all duration-200 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md hover:border-blue-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded font-Lexend">
                          {record.service?.name || "N/A"}
                        </span>
                        <span className="text-xs text-gray-500 font-Lexend">
                          {formatDate(record.visitDate)} at{" "}
                          {formatTime(record.visitDate)}
                        </span>
                      </div>
                      <h4 className="mb-1 text-sm font-bold text-gray-900 font-Lexend">
                        {record.chiefComplaint || "No chief complaint"}
                      </h4>
                      {record.diagnosis && (
                        <p className="text-xs text-gray-600 line-clamp-2 font-Lexend">
                          Diagnosis: {record.diagnosis}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                    <div className="text-xs text-gray-500 font-Lexend">
                      <p>
                        Recorded by:{" "}
                        {record.recordedBy
                          ? `${record.recordedBy.firstName} ${record.recordedBy.lastName}`
                          : "N/A"}
                      </p>
                      {record.updateHistory &&
                        record.updateHistory.length > 0 && (
                          <p className="mt-1">
                            Last updated by:{" "}
                            {record.updateHistory[
                              record.updateHistory.length - 1
                            ].updatedBy
                              ? `${record.updateHistory[record.updateHistory.length - 1].updatedBy.firstName} ${record.updateHistory[record.updateHistory.length - 1].updatedBy.lastName}`
                              : "N/A"}{" "}
                            on{" "}
                            {formatDate(
                              record.updateHistory[
                                record.updateHistory.length - 1
                              ].updatedAt,
                            )}{" "}
                            at{" "}
                            {formatTime(
                              record.updateHistory[
                                record.updateHistory.length - 1
                              ].updatedAt,
                            )}
                          </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewRecord(record)}
                        className="p-2 text-blue-600 transition-all duration-200 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditRecord(record)}
                        className="p-2 text-green-600 transition-all duration-200 bg-green-100 border border-green-200 rounded-lg hover:bg-green-200"
                        title="Edit Record"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
