import ViewModalHeader from "../medicalRecord/ViewModalHeader";
import RecordedByFooter from "../medicalRecord/RecordedByFooter";
import ChiefComplaintSection from "./ChiefComplaintSection";
import VitalSignsSection from "./VitalSignsSection";
import ClinicalAssessmentSection from "./ClinicalAssessmentSection";
import AdditionalNotesSection from "./AdditionalNotesSection";
import PrescriptionsSection from "./PrescriptionsSection";

export default function RecordContent({ record }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6 md:p-8">
        <ViewModalHeader
          serviceName={record.service?.name}
          visitDate={record.visitDate}
        />

        <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
          <ChiefComplaintSection chiefComplaint={record.chiefComplaint} />

          <VitalSignsSection vitalSigns={record.vitalSigns} />

          <ClinicalAssessmentSection
            diagnosis={record.diagnosis}
            treatmentNotes={record.treatmentNotes}
          />

          <AdditionalNotesSection additionalNotes={record.additionalNotes} />

          <PrescriptionsSection prescriptions={record.prescriptions} />

          <RecordedByFooter
            recordedBy={record.recordedBy}
            recordDate={record.visitDate}
            updateHistory={record.updateHistory}
          />
        </div>
      </div>
    </div>
  );
}
