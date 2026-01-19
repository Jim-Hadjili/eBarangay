import Modal from "../../ui/Modal";
import { Plus, Briefcase, X } from "lucide-react";
import { useAddServiceModal } from "../../../hooks/useAddServiceModal";

export default function AddServiceModal({ isOpen, onClose, onSuccess }) {
  const { formData, loading, error, handleChange, handleSubmit, handleClose } =
    useAddServiceModal({ onClose, onSuccess });

  function handleIdentifierChange(e) {
    let value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    handleChange({
      target: {
        name: "identifier",
        value,
      },
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="default">
      <div className="flex flex-col w-full gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 text-green-600 rounded-lg sm:w-12 sm:h-12 bg-green-50">
            <Briefcase size={20} strokeWidth={2} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl font-Lexend">
              Add New Service
            </h2>
            <p className="text-xs text-gray-600 sm:text-sm font-Lexend">
              Create a new healthcare service
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
          {/* Service Identifier */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
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
              onChange={handleIdentifierChange}
              placeholder="e.g., SVCX"
              className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
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
              className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg resize-none sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Queue Limit */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <label
              htmlFor="queueLimit"
              className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
            >
              Queue Limit (Optional)
            </label>
            <input
              type="number"
              id="queueLimit"
              name="queueLimit"
              value={formData.queueLimit}
              onChange={handleChange}
              placeholder="Leave empty for unlimited"
              min="1"
              className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
            />
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
              className="flex items-center justify-center flex-1 gap-2 px-3 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg cursor-pointer sm:px-4 sm:py-3 hover:bg-green-700 font-Lexend disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white rounded-full sm:w-5 sm:h-5 border-t-transparent animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus size={18} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
                  <span>Add Service</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
