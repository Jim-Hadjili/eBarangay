import { Clock } from "lucide-react";

export default function QueueMonitoringTab() {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl font-Lexend">
          Real-time Queue Monitoring
        </h2>

        {/* Coming Soon State */}
        <div className="p-12 mt-10 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
            <Clock className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-gray-900 font-Lexend">
            Coming Soon
          </h3>
          <p className="mb-6 text-sm text-gray-600 font-Lexend">
            This feature is under development and will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}
