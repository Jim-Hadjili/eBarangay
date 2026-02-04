import { memo } from "react";

function ModalActions({
  onCancel,
  onSubmit,
  isLoading,
  actionType,
  cancelText = "Cancel",
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-200">
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="flex-1 px-4 py-2.5 cursor-pointer text-sm font-semibold text-gray-700 transition-all bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelText}
      </button>
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="flex-1 px-4 py-2.5 cursor-pointer text-sm font-semibold text-white transition-all bg-linear-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Saving...
          </span>
        ) : actionType === "call" ? (
          "Save & Call Next"
        ) : (
          "Save & Complete"
        )}
      </button>
    </div>
  );
}

export default memo(ModalActions);
