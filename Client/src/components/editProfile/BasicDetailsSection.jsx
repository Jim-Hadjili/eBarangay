export default function BasicDetailsSection({ formData, onChange, user }) {
  // Check if user is patient (not Admin or Super Admin)
  const isPatient = user?.userType === "Patient";

  // Check if current priority status is Senior Citizen
  const isSeniorCitizen = user?.priorityStatus === "Senior Citizen";

  // Determine if Date of Birth should be disabled
  const isDateOfBirthDisabled = isSeniorCitizen;

  // Determine if Priority Status should be disabled
  const isPriorityStatusDisabled = isSeniorCitizen;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-5">
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900">Basic Details</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Date of Birth
          {isDateOfBirthDisabled && (
            <span className="ml-2 text-xs text-gray-500">
              (Cannot be changed for Senior Citizens)
            </span>
          )}
        </label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={onChange}
          disabled={isDateOfBirthDisabled}
          className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            isDateOfBirthDisabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Priority Status - Only for Patients */}
      {isPatient && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Priority Status
            {isPriorityStatusDisabled && (
              <span className="ml-2 text-xs text-gray-500">
                (Cannot be changed once set to Senior Citizen)
              </span>
            )}
          </label>
          <select
            name="priorityStatus"
            value={formData.priorityStatus}
            onChange={onChange}
            disabled={isPriorityStatusDisabled}
            className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              isPriorityStatusDisabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="None">None</option>
            <option value="PWD">PWD (Person with Disability)</option>
            <option value="Senior Citizen">
              Senior Citizen (60+ years old)
            </option>
          </select>
          {formData.priorityStatus === "Senior Citizen" && (
            <p className="mt-1 text-xs text-blue-600">
              Note: You must be 60 years or older to select Senior Citizen
              status
            </p>
          )}
        </div>
      )}
    </div>
  );
}
