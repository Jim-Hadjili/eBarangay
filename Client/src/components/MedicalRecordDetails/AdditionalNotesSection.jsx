import ViewField from "../medicalRecord/ViewField";

export default function AdditionalNotesSection({ additionalNotes }) {
  if (!additionalNotes) return null;

  return (
    <section className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-blue-50">
      <ViewField label="Additional Notes" value={additionalNotes} />
    </section>
  );
}
