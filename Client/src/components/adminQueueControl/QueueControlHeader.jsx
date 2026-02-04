import { ArrowLeft } from "lucide-react";

export default function QueueControlHeader({ serviceName, onBack }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-3 mx-auto max-w-7xl sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 font-Lexend truncate">
                {serviceName}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
