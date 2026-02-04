import MedicalRecordCard from "./MedicalRecordCard";

export default function MedicalRecordsGrid({ records }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
      {records.map((record) => (
        <MedicalRecordCard key={record._id} record={record} />
      ))}
    </div>
  );
}
