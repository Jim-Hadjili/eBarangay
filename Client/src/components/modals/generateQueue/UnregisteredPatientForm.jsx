import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { useServices } from "../../../hooks/useServices";
import { getToken } from "../../../utils/session";
import { SuccessScreen } from "./QueueTicket";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  priorityStatus: "None",
  address: "",
  serviceId: "",
};

const FIELD_ERRORS = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  address: "",
  serviceId: "",
};

/**
 * Form for registering a walk-in (unregistered) patient and placing them in
 * the queue. On success, displays the shared SuccessScreen.
 *
 * @param {{ onBack: () => void, onClose: () => void }} props
 */
export default function UnregisteredPatientForm({ onBack, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState(FIELD_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [queueResult, setQueueResult] = useState(null);

  const { services, loading: servicesLoading } = useServices();
  const availableServices = services.filter((s) => s.status !== "unavailable");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = { ...FIELD_ERRORS };
    let valid = true;

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required.";
      valid = false;
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    }
    if (!form.gender) {
      newErrors.gender = "Gender is required.";
      valid = false;
    }
    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
      valid = false;
    }
    if (!form.address.trim()) {
      newErrors.address = "Address is required.";
      valid = false;
    }
    if (!form.serviceId) {
      newErrors.serviceId = "Please select a service.";
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
        `${import.meta.env.VITE_API_URL}/queue/join-walk-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate queue number");
      }

      setQueueResult(data);
    } catch (err) {
      setErrors((prev) => ({ ...prev, serviceId: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2.5 text-sm rounded-lg border font-Lexend outline-none transition-colors ${
      errors[field]
        ? "border-red-400 bg-red-50 focus:border-red-500"
        : "border-gray-300 bg-white focus:border-orange-400"
    }`;

  const labelClass =
    "block text-xs font-semibold text-gray-600 font-Lexend mb-1";

  if (queueResult)
    return <SuccessScreen queueResult={queueResult} onClose={onClose} />;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-gray-700 shrink-0"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-xl border border-orange-300">
            <FontAwesomeIcon icon={faUser} className="text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-Lexend leading-tight">
              Unregistered Patient
            </h3>
            <p className="text-xs text-gray-500 font-Lexend">
              Enter walk-in patient information
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="e.g. Juan"
              className={inputClass("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1 font-Lexend">
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="e.g. Dela Cruz"
              className={inputClass("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1 font-Lexend">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Gender & Date of Birth */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className={labelClass}>
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={inputClass("gender")}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500 mt-1 font-Lexend">
                {errors.gender}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className={inputClass("dateOfBirth")}
            />
            {errors.dateOfBirth && (
              <p className="text-xs text-red-500 mt-1 font-Lexend">
                {errors.dateOfBirth}
              </p>
            )}
          </div>
        </div>

        {/* Priority Status */}
        <div className="mb-3">
          <label className={labelClass}>Priority Status</label>
          <select
            name="priorityStatus"
            value={form.priorityStatus}
            onChange={handleChange}
            className={inputClass("priorityStatus")}
          >
            <option value="None">None</option>
            <option value="Senior Citizen">Senior Citizen</option>
            <option value="PWD">PWD</option>
          </select>
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className={labelClass}>
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="e.g. 123 Rizal St., Barangay San Jose"
            rows={2}
            className={`${inputClass("address")} resize-none`}
          />
          {errors.address && (
            <p className="text-xs text-red-500 mt-1 font-Lexend">
              {errors.address}
            </p>
          )}
        </div>

        {/* Service */}
        <div className="mb-5">
          <label className={labelClass}>
            Service <span className="text-red-500">*</span>
          </label>
          <select
            name="serviceId"
            value={form.serviceId}
            onChange={handleChange}
            disabled={servicesLoading}
            className={inputClass("serviceId")}
          >
            <option value="">
              {servicesLoading ? "Loading services..." : "Select a service"}
            </option>
            {availableServices.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
          {errors.serviceId && (
            <p className="text-xs text-red-500 mt-1 font-Lexend">
              {errors.serviceId}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
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
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer font-Lexend disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Generating..." : "Generate Queue"}
          </button>
        </div>
      </form>
    </div>
  );
}
