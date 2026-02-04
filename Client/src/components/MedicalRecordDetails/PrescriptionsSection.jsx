import ViewPrescriptions from "../medicalRecord/ViewPrescriptions";

export default function PrescriptionsSection({ prescriptions }) {
  if (!prescriptions || prescriptions.length === 0) return null;

  return (
    <section className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <ViewPrescriptions prescriptions={prescriptions} />
    </section>
  );
}
