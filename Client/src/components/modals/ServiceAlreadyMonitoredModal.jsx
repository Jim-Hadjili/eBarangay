import Modal from "../ui/Modal";
import { Lock } from "lucide-react";

export default function ServiceAlreadyMonitoredModal({
  isOpen,
  onClose,
  serviceName,
  monitoredBy,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="default">
      <div className="w-full">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-50">
          <Lock className="w-8 h-8 text-red-600" />
        </div>

        <h3 className="mb-2 text-xl font-bold text-center text-gray-900 font-Lexend">
          Service Currently Monitored
        </h3>

        <p className="mb-6 text-sm text-center text-gray-600 font-Lexend">
          <span className="font-semibold text-gray-900">{serviceName}</span> is
          currently being monitored by{" "}
          <span className="font-semibold text-gray-900">{monitoredBy}</span>.
          Please wait until they finish monitoring.
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
