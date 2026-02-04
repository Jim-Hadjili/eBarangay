import { memo, useCallback } from "react";
import Modal from "../ui/Modal";
import ViewModalHeader from "../medicalRecord/ViewModalHeader";
import ViewField from "../medicalRecord/ViewField";
import ViewVitalSigns from "../medicalRecord/ViewVitalSigns";
import ViewPrescriptions from "../medicalRecord/ViewPrescriptions";
import RecordedByFooter from "../medicalRecord/RecordedByFooter";

function ViewMedicalRecordModal({ isOpen, onClose, record }) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!record) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="large">
      <div className="w-full">
        <ViewModalHeader
          serviceName={record.service?.name}
          visitDate={record.visitDate}
        />

        <div className="max-h-[calc(80vh-200px)] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Chief Complaint Section */}
          <section className="p-3 border border-gray-200 rounded-lg bg-blue-50">
            <ViewField
              label="Chief Complaint"
              value={record.chiefComplaint || "N/A"}
            />
          </section>

          {/* Vital Signs Section */}
          <section className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
            <ViewVitalSigns vitalSigns={record.vitalSigns} />
          </section>

          {/* Clinical Assessment Section */}
          <section className="p-3 space-y-3 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div className="w-1 h-5 rounded-full bg-blue-600"></div>
              <h4 className="text-sm font-bold text-gray-900 font-Lexend">
                Clinical Assessment
              </h4>
            </div>

            <ViewField label="Assessment/Diagnosis" value={record.diagnosis} />

            <ViewField
              label="Treatment/Clinical Notes"
              value={record.treatmentNotes}
            />
          </section>

          {/* Additional Notes Section */}
          {record.additionalNotes && (
            <section className="p-3 border border-gray-200 rounded-lg bg-blue-50">
              <ViewField
                label="Additional Notes"
                value={record.additionalNotes}
              />
            </section>
          )}

          {/* Prescriptions Section */}
          {record.prescriptions && record.prescriptions.length > 0 && (
            <section className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
              <ViewPrescriptions prescriptions={record.prescriptions} />
            </section>
          )}

          {/* Footer */}
          <RecordedByFooter
            recordedBy={record.recordedBy}
            updateHistory={record.updateHistory}
          />
        </div>
      </div>
    </Modal>
  );
}

export default memo(ViewMedicalRecordModal);
