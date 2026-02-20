import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUserCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useServices } from "../../../hooks/useServices";
import { usePatients } from "../../../hooks/usePatients";
import { getToken } from "../../../utils/session";
import { SuccessScreen } from "./QueueTicket";

/**

 * @param {{ onBack: () => void, onClose: () => void }} props
 */
export default function ExistingPatientForm({ onBack, onClose }) {
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [errors, setErrors] = useState({ patient: "", service: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queueResult, setQueueResult] = useState(null);

  const { patients, loading: patientsLoading } = usePatients();
  const { services, loading: servicesLoading } = useServices();
  const availableServices = services.filter((s) => s.status !== "unavailable");

  const filteredPatients =
    search.trim().length >= 1
      ? patients
          .filter(
            (p) =>
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.email.toLowerCase().includes(search.toLowerCase()),
          )
          .slice(0, 6)
      : [];

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearch(patient.name);
    setShowDropdown(false);
    if (errors.patient) setErrors((prev) => ({ ...prev, patient: "" }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSelectedPatient(null);
    setShowDropdown(true);
  };

  const validate = () => {
    const newErrors = { patient: "", service: "" };
    let valid = true;
    if (!selectedPatient) {
      newErrors.patient = "Please select a registered patient.";
      valid = false;
    }
    if (!serviceId) {
      newErrors.service = "Please select a service.";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const token = getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/queue/admin-join-existing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ patientId: selectedPatient.id, serviceId }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to generate queue number");
      setQueueResult(data);
    } catch (err) {
      setErrors((prev) => ({ ...prev, service: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (queueResult)
    return <SuccessScreen queueResult={queueResult} onClose={onClose} />;

  const fieldClass = (hasError) =>
    `w-full px-3 py-2.5 text-sm rounded-lg border font-Lexend outline-none transition-colors ${
      hasError
        ? "border-red-400 bg-red-50 focus:border-red-500"
        : "border-gray-300 bg-white focus:border-blue-400"
    }`;

  const labelClass =
    "block text-xs font-semibold text-gray-600 font-Lexend mb-1";

  return (
    <div className="w-full flex flex-col max-h-[68vh]">
      {/* Header — always visible */}
      <div className="shrink-0 flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-gray-700 shrink-0"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl border border-blue-300">
            <FontAwesomeIcon icon={faUserCheck} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-Lexend leading-tight">
              Existing Patient
            </h3>
            <p className="text-xs text-gray-500 font-Lexend">
              Search and select a registered patient
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col flex-1 min-h-0"
      >
        {/* Scrollable fields area */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {/* Patient search */}
          <div className="mb-3 relative">
            <label className={labelClass}>
              Patient <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => search.trim() && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                placeholder={
                  patientsLoading
                    ? "Loading patients..."
                    : "Search by name or email..."
                }
                disabled={patientsLoading}
                autoComplete="off"
                className={`${fieldClass(!!errors.patient)} pr-8`}
              />
              {selectedPatient && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPatient(null);
                    setSearch("");
                    setShowDropdown(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </button>
              )}
            </div>

            {/* Dropdown list */}
            {showDropdown && filteredPatients.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredPatients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onMouseDown={() => handleSelectPatient(p)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 shrink-0 text-xs font-bold text-blue-600">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 font-Lexend truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500 font-Lexend truncate">
                        {p.email}
                      </p>
                    </div>
                    {p.priorityStatus !== "None" && (
                      <span className="ml-auto shrink-0 text-xs font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-Lexend">
                        {p.priorityStatus}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {showDropdown &&
              search.trim().length >= 1 &&
              filteredPatients.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500 font-Lexend">
                  No patients found.
                </div>
              )}

            {errors.patient && (
              <p className="text-xs text-red-500 mt-1 font-Lexend">
                {errors.patient}
              </p>
            )}
          </div>

          {/* Selected patient card */}
          {selectedPatient && (
            <div className="mb-3 px-3 py-2.5 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-200 shrink-0 text-sm font-bold text-blue-700">
                {selectedPatient.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 font-Lexend">
                  {selectedPatient.name}
                </p>
                <p className="text-xs text-gray-500 font-Lexend">
                  {selectedPatient.email}
                </p>
              </div>
              {selectedPatient.priorityStatus !== "None" && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-Lexend shrink-0">
                  {selectedPatient.priorityStatus}
                </span>
              )}
            </div>
          )}

          {/* Service */}
          <div className="mb-3">
            <label className={labelClass}>
              Service <span className="text-red-500">*</span>
            </label>
            <select
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                if (errors.service)
                  setErrors((prev) => ({ ...prev, service: "" }));
              }}
              disabled={servicesLoading}
              className={fieldClass(!!errors.service)}
            >
              <option value="">
                {servicesLoading ? "Loading services..." : "Select a service"}
              </option>
              {availableServices.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.service && (
              <p className="text-xs text-red-500 mt-1 font-Lexend">
                {errors.service}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons — always visible */}
        <div className="shrink-0 flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer font-Lexend disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-Lexend disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Generating..." : "Generate Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}
