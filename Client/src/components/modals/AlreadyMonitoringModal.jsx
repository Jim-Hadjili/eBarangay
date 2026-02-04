import Modal from "../ui/Modal";
import { AlertCircle } from "lucide-react";

export default function AlreadyMonitoringModal({
  isOpen,
  onClose,
  currentService,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="default">
      <div className="w-full">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-orange-50">
          <AlertCircle className="w-8 h-8 text-orange-600" />
        </div>

        <h3 className="mb-2 text-xl font-bold text-center text-gray-900 font-Lexend">
          Already Monitoring a Service
        </h3>

        <p className="mb-6 text-sm text-center text-gray-600 font-Lexend">
          You are currently monitoring{" "}
          <span className="font-semibold text-gray-900">
            {currentService?.name}
          </span>
          . Please stop monitoring this service before starting to monitor
          another one.
        </p>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 font-Lexend"
        >
          Understood
        </button>
      </div>
    </Modal>
  );
}
