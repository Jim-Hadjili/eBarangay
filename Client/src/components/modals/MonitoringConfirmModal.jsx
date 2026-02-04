import Modal from "../ui/Modal";
import { AlertCircle } from "lucide-react";

export default function MonitoringConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  service,
  isLoading,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="default">
      <div className="w-full">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50">
          <AlertCircle className="w-8 h-8 text-blue-600" />
        </div>

        <h3 className="mb-2 text-xl font-bold text-center text-gray-900 font-Lexend">
          Start Monitoring Service?
        </h3>

        <p className="mb-6 text-sm text-center text-gray-600 font-Lexend">
          Do you want to start monitoring{" "}
          <span className="font-semibold text-gray-900">{service?.name}</span>?
          You will be able to manage the queue and call patients.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 cursor-pointer text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 cursor-pointer text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Starting..." : "Yes, Start Monitoring"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
