import Modal from "../../components/ui/Modal.jsx";

export default function LogOutModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="default">
      <div className="flex flex-col items-center w-full gap-6">
        {/* Warning Icon */}
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Confirm Logout
          </h2>
          <p className="text-gray-600">
            Are you sure you want to logout from your account?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-3 font-medium text-white transition-colors bg-red-600 rounded-lg cursor-pointer hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
}
