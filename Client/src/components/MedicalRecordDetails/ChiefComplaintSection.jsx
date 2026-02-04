import ViewField from "../medicalRecord/ViewField";

export default function ChiefComplaintSection({ chiefComplaint }) {
  return (
    <section className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-blue-50">
      <ViewField label="Chief Complaint" value={chiefComplaint || "N/A"} />
    </section>
  );
}
