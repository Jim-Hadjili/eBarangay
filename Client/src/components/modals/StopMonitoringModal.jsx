import Modal from "../ui/Modal";
import { AlertCircle } from "lucide-react";

export default function StopMonitoringModal({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  isLoading,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="default">
      <div className="w-full">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50">
          <AlertCircle className="w-8 h-8 text-amber-600" />
        </div>

        <h3 className="mb-2 text-xl font-bold text-center text-gray-900 font-Lexend">
          Stop Monitoring Service?
        </h3>

        <p className="mb-6 text-sm text-center text-gray-600 font-Lexend">
          Are you sure you want to stop monitoring{" "}
          <span className="font-semibold text-gray-900">{serviceName}</span>?
          The service will become available for other admins to monitor.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-Lexend"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-sm font-medium text-white transition-colors bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed font-Lexend"
          >
            {isLoading ? "Stopping..." : "Yes, Stop Monitoring"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
