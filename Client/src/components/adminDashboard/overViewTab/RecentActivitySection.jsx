import { Clock } from "lucide-react";
import ActivityItem from "../../ui/ActivityItem";

export default function RecentActivitySection({ activities, loading }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="px-5 py-4 bg-gray-100 border-b border-gray-600 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl font-Lexend">
              Recent Activity
            </h3>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm font-Lexend">
              Latest system activities and updates
            </p>
          </div>
        </div>
      </div>
      <div className="px-5 py-4 sm:px-6 sm:py-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="w-12 h-12 mb-4 border-4 border-green-200 rounded-full sm:w-16 sm:h-16 border-t-green-600 animate-spin"></div>
            <p className="text-sm text-gray-600 sm:text-base font-Lexend">
              Loading activities...
            </p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full sm:w-20 sm:h-20">
              <Clock className="w-8 h-8 text-gray-400 sm:w-10 sm:h-10" />
            </div>
            <p className="mb-1 text-sm font-semibold text-gray-600 sm:text-base">
              No recent activities
            </p>
            <p className="text-xs text-gray-500 sm:text-sm font-Lexend">
              Activity will appear here when available
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((activity) => (
              <ActivityItem key={activity._id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
