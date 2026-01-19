import Modal from "./Modal";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="default"
      hideCloseButton={loading}
    >
      <div className="flex flex-col w-full gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 text-red-600 rounded-lg sm:w-12 sm:h-12 bg-red-50">
            <AlertTriangle
              size={20}
              strokeWidth={2}
              className="sm:w-6 sm:h-6"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl font-Lexend">
              {title}
            </h2>
            <p className="text-xs text-gray-600 sm:text-sm font-Lexend">
              This action is permanent
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="p-3 border border-red-200 rounded-lg sm:p-4 bg-red-50">
          <p className="text-xs text-gray-900 sm:text-sm font-Lexend">
            {message}
          </p>
          {itemName && (
            <p className="mt-2 text-xs font-semibold text-red-700 sm:text-sm font-Lexend">
              Item: <span className="font-bold">{itemName}</span>
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg cursor-pointer sm:px-4 sm:py-3 hover:bg-gray-300 font-Lexend disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center justify-center flex-1 gap-2 px-3 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg cursor-pointer sm:px-4 sm:py-3 hover:bg-red-700 font-Lexend disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white rounded-full sm:w-5 sm:h-5 border-t-transparent animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={18} strokeWidth={2.5} className="sm:w-5 sm:h-5" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
