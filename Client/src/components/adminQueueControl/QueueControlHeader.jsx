import { ArrowLeft } from "lucide-react";

export default function QueueControlHeader({ serviceName, onBack }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-Lexend">
                {serviceName}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
