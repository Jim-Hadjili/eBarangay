import ViewField from "../medicalRecord/ViewField";

export default function ClinicalAssessmentSection({
  diagnosis,
  treatmentNotes,
}) {
  return (
    <section className="p-3 sm:p-4 space-y-2 sm:space-y-3 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <div className="w-1 h-4 sm:h-5 rounded-full bg-blue-600"></div>
        <h4 className="text-xs sm:text-sm font-bold text-gray-900 font-Lexend">
          Clinical Assessment
        </h4>
      </div>

      <ViewField label="Assessment/Diagnosis" value={diagnosis} />

      <ViewField label="Treatment/Clinical Notes" value={treatmentNotes} />
    </section>
  );
}
