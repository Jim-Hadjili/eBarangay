import Modal from "../../ui/Modal";
import { Plus, UserCog, X } from "lucide-react";
import { useAddAdminModal } from "../../../hooks/useAddAdminModal";

export default function AddAdminUserModal({ isOpen, onClose, onSuccess }) {
  const { formData, loading, error, handleChange, handleSubmit, handleClose } =
    useAddAdminModal({ onClose, onSuccess });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="large">
      <div className="flex flex-col w-full gap-4 sm:gap-2">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 text-green-600 rounded-lg sm:w-12 sm:h-12 bg-green-50">
            <UserCog size={20} strokeWidth={2} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl font-Lexend">
              Add New Admin User
            </h2>
            <p className="text-xs text-gray-600 sm:text-sm font-Lexend">
              Create a new admin account
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Left Column */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* First Name */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label
                  htmlFor="firstName"
                  className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="e.g., Juan"
                  className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                  required
                  autoComplete="off"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., juan@ebarangay.com"
                  className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                  required
                  autoComplete="off"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                  required
                  minLength={6}
                />
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label
                  htmlFor="dateOfBirth"
                  className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
                >
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Last Name */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label
                  htmlFor="lastName"
                  className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="e.g., Dela Cruz"
                  className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                  required
                  autoComplete="off"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label
                  htmlFor="phone"
                  className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., 0912-345-6789"
                  className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                  required
                  autoComplete="off"
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label
                  htmlFor="gender"
                  className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
                >
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label
                  htmlFor="address"
                  className="text-xs font-semibold text-gray-700 sm:text-sm font-Lexend"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  rows={3}
                  className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg resize-none sm:px-4 sm:py-3 font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 mt-3 border border-red-200 rounded-lg sm:px-4 sm:py-3 sm:mt-4 bg-red-50">
              <X size={16} className="text-red-600 sm:w-4.5 sm:h-4.5" />
              <p className="text-xs text-red-600 sm:text-sm font-Lexend">
                {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3 sm:gap-3 sm:mt-2">
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
                  <span>Add Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
