import { Clock, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import DeleteConfirmModal from "../ui/DeleteConfirmModal";

const getPriorityBadge = (priorityStatus) => {
  if (priorityStatus === "Senior Citizen") {
    return (
      <span className="px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full font-Lexend">
        Senior
      </span>
    );
  }
  if (priorityStatus === "PWD") {
    return (
      <span className="px-2 py-0.5 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full font-Lexend">
        PWD
      </span>
    );
  }
  return null;
};

export default function WaitingQueueCard({
  waitingQueues,
  skippedQueues,
  onRecallPatient,
  onRemovePatient,
}) {
  const [activeTab, setActiveTab] = useState("main");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToRemove, setPatientToRemove] = useState(null);

  const handleRemoveClick = (queue) => {
    setPatientToRemove(queue);
    setShowDeleteModal(true);
  };

  const handleConfirmRemove = () => {
    if (patientToRemove) {
      onRemovePatient(patientToRemove._id);
      setShowDeleteModal(false);
      setPatientToRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setShowDeleteModal(false);
    setPatientToRemove(null);
  };

  // Sort by priority: Senior Citizen > PWD > Regular (by queue number)
  const sortedQueues = [...waitingQueues].sort((a, b) => {
    const priorityOrder = { "Senior Citizen": 0, PWD: 1, None: 2 };
    const aPriority = priorityOrder[a.patient?.priorityStatus] ?? 2;
    const bPriority = priorityOrder[b.patient?.priorityStatus] ?? 2;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    return a.queueNumber - b.queueNumber;
  });

  // Sort skipped queues by when they were skipped
  const sortedSkippedQueues = [...(skippedQueues || [])].sort((a, b) => {
    return new Date(a.skippedAt) - new Date(b.skippedAt);
  });

  const hasSkippedPatients = sortedSkippedQueues.length > 0;

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="px-6 py-4 bg-gray-200 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 font-Lexend flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            WAITING QUEUE
          </h3>
          <span className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full font-Lexend">
            {sortedQueues.length} patients
          </span>
        </div>

        {/* Tabs */}
        {hasSkippedPatients && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={() => setActiveTab("main")}
              className={`px-4 py-2 text-sm cursor-pointer font-medium rounded-lg transition-colors font-Lexend ${
                activeTab === "main"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Main List
            </button>
            <button
              onClick={() => setActiveTab("recall")}
              className={`px-4 py-2 text-sm cursor-pointer font-medium rounded-lg transition-colors font-Lexend flex items-center justify-center gap-2 ${
                activeTab === "recall"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              Recall List ({sortedSkippedQueues.length})
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        {activeTab === "main" ? (
          sortedQueues.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sortedQueues.map((queue, index) => (
                <div
                  key={queue._id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index === 0
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-gray-900 font-Lexend">
                        {queue.queueCode}
                      </div>
                      {getPriorityBadge(queue.patient?.priorityStatus)}
                    </div>
                    <div className="text-sm text-gray-600 font-Lexend">
                      {queue.patient?.firstName} {queue.patient?.lastName}
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-200 rounded font-Lexend">
                      Next
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 font-Lexend">
              No patients in queue
            </div>
          )
        ) : sortedSkippedQueues.length > 0 ? (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sortedSkippedQueues.map((queue) => (
              <div
                key={queue._id}
                className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-gray-900 font-Lexend">
                      {queue.queueCode}
                    </div>
                    {getPriorityBadge(queue.patient?.priorityStatus)}
                  </div>
                  <div className="text-sm text-gray-600 font-Lexend">
                    {queue.patient?.firstName} {queue.patient?.lastName}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRecallPatient(queue._id)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-orange-600 rounded hover:bg-orange-700 transition-colors font-Lexend cursor-pointer"
                  >
                    Recall
                  </button>
                  <button
                    onClick={() => handleRemoveClick(queue)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="Remove from recall list"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500 font-Lexend">
            No skipped patients
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        title="Remove Patient"
        message="Are you sure you want to remove this patient from the recall list? This will mark them as cancelled and they will not be able to be recalled."
        itemName={
          patientToRemove
            ? `${patientToRemove.queueCode} - ${patientToRemove.patient?.firstName} ${patientToRemove.patient?.lastName}`
            : ""
        }
      />
    </div>
  );
}
