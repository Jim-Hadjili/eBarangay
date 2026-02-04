import Modal from "./Modal";
import { Briefcase, X, Pencil } from "lucide-react";
import { useState, useEffect } from "react";

export default function EditServiceModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    identifier: "",
    name: "",
    description: "",
    queueLimit: "",
    status: "available",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      let actualStatus = "available";
      if (initialData.serviceStatus) {
        actualStatus = initialData.serviceStatus;
      } else if (initialData.status === "unavailable") {
        actualStatus = "unavailable";
      }

      setFormData({
        identifier: initialData.identifier || "",
        name: initialData.name || "",
        description: initialData.description || "",
        queueLimit: initialData.queueLimit || "",
        status: actualStatus,
      });
      setError("");
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "identifier") {
      // Only allow uppercase letters, max 4 chars
      const lettersOnly = value
        .replace(/[^A-Za-z]/g, "")
        .toUpperCase()
        .slice(0, 4);
      setFormData((prev) => ({
        ...prev,
        [name]: lettersOnly,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "available" ? "unavailable" : "available",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.name || !formData.description) {
      setError("Identifier, name, and description are required.");
      return;
    }
    onSave(formData);
  };

  const handleClose = () => {
    if (!loading) {
      setError("");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="default">
      <div className="flex flex-col w-full gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 text-blue-600 rounded-lg sm:w-12 sm:h-12 bg-blue-50">
            <Pencil size={20} strokeWidth={2} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl font-Lexend">
              Edit Service
            </h2>
            <p className="text-xs text-gray-600 sm:text-sm font-Lexend">
              Update the service details below
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 ">
          {/* Service Identifier */}
          <div className="flex flex-col gap-1.5 ">
            <label
              htmlFor="identifier"
              className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
            >
              Service Identifier <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="e.g., SVCX"
              className="px-3 py-2 text-sm text-gray-900 uppercase border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
              maxLength={4}
              autoComplete="off"
            />
          </div>

          {/* Service Name */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label
              htmlFor="name"
              className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
            >
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Medical Consultation"
              className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label
              htmlFor="description"
              className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter service description..."
              rows={4}
              className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg resize-none sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Queue Limit */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label
              htmlFor="queueLimit"
              className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
            >
              Queue Limit <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="queueLimit"
              name="queueLimit"
              value={formData.queueLimit}
              onChange={handleChange}
              placeholder="Minimum 20"
              min="20"
              required
              className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Status Toggle Switch */}
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg sm:p-4 bg-gray-50">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend">
                Service Status
              </span>
              <span className="text-[11px] text-gray-500 sm:text-xs font-Lexend">
                {formData.status === "available"
                  ? "Patients can book this service"
                  : "Service is temporarily unavailable"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleStatusToggle}
              disabled={loading}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                formData.status === "available" ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                  formData.status === "available"
                    ? "translate-x-7"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 mt-2 border border-red-200 rounded-lg sm:px-4 sm:py-3 bg-red-50">
              <X size={16} className="text-red-600 sm:w-4.5 sm:h-4.5" />
              <p className="text-xs text-red-600 sm:text-sm font-Lexend">
                {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-2 sm:gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg cursor-pointer sm:px-4 sm:py-3 hover:bg-gray-300 font-Lexend disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center flex-1 gap-2 px-3 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg cursor-pointer sm:px-4 sm:py-3 hover:bg-blue-700 font-Lexend disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full sm:w-5 sm:h-5 border-t-transparent animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Briefcase
                    size={18}
                    strokeWidth={2.5}
                    className="sm:w-5 sm:h-5"
                  />
                  <span>Update</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
