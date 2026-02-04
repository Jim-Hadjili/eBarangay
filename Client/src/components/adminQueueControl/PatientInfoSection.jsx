export default function PatientInfoSection({ patient }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-gray-700 uppercase font-Lexend">
        Patient Information
      </h4>
      <div className="space-y-2">
        <InfoRow
          label="Name"
          value={`${patient.firstName} ${patient.lastName}`}
        />
        <InfoRow label="Email" value={patient.email || "N/A"} />
        <InfoRow label="Phone" value={patient.phone || "N/A"} />
        <InfoRow
          label="Date of Birth"
          value={
            patient.dateOfBirth
              ? new Date(patient.dateOfBirth).toLocaleDateString()
              : "N/A"
          }
        />
        <InfoRow label="Gender" value={patient.gender || "N/A"} />
        <InfoRow label="Address" value={patient.address || "N/A"} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-2">
      <span className="text-xs sm:text-sm font-medium text-gray-600 font-Lexend">
        {label}
      </span>
      <span className="text-xs sm:text-sm text-gray-900 font-Lexend break-words">
        {value}
      </span>
    </div>
  );
}
