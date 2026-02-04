import ViewVitalSigns from "../medicalRecord/ViewVitalSigns";

export default function VitalSignsSection({ vitalSigns }) {
  return (
    <section className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      <ViewVitalSigns vitalSigns={vitalSigns} />
    </section>
  );
}
