import { Users, Briefcase, Clock, UserCog } from "lucide-react";
import OverviewCard from "../../../components/ui/OverviewCard";
import ActivityItem from "../../../components/ui/ActivityItem";
import { useDashboard } from "../../../hooks/useDashboard";
import { useActivity } from "../../../hooks/useActivity";

export default function OverviewTab() {
  const { stats, loading, error } = useDashboard();
  const { activities, loading: activitiesLoading } = useActivity(10);

  const overviewData = [
    {
      title: "Total Patients",
      value: loading ? "..." : stats.totalPatients.toLocaleString(),
      icon: Users,
      description: "Registered patients",
      descriptionColor: "text-blue-600",
    },
    {
      title: "Active Services",
      value: loading ? "..." : stats.activeServices,
      icon: Briefcase,
      description: "Available services",
      descriptionColor: "text-purple-600",
    },
    {
      title: "Queue Today",
      value: loading ? "..." : stats.queueToday,
      icon: Clock,
      description: "Total queues today",
      descriptionColor: "text-orange-600",
    },
    {
      title: "Total Staff Available",
      value: loading ? "..." : stats.totalStaff,
      icon: UserCog,
      description: "Active staff members",
      descriptionColor: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl font-Lexend">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-600 sm:text-base font-Lexend">
            Monitor your healthcare system at a glance
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 border-l-4 border-red-500 rounded-lg shadow-sm sm:mb-8 sm:p-5 bg-red-50">
            <div className="flex items-start">
              <div className="shrink-0">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  Error loading dashboard data: {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 lg:gap-6 sm:mb-10 lg:mb-12">
          {overviewData.map((card) => (
            <OverviewCard key={card.title} {...card} />
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          {/* Section Header */}
          <div className="px-5 py-4 border-b border-gray-200 sm:px-6 sm:py-5 bg-linear-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl font-Lexend">
                  Recent Activity
                </h3>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm font-Lexend">
                  Latest system activities and updates
                </p>
              </div>
              {!activitiesLoading && activities.length > 0 && (
                <span className="items-center hidden px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full sm:inline-flex">
                  {activities.length}{" "}
                  {activities.length === 1 ? "Activity" : "Activities"}
                </span>
              )}
            </div>
          </div>

          {/* Activity List */}
          <div className="px-5 py-4 sm:px-6 sm:py-5">
            {activitiesLoading ? (
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
      </div>
    </div>
  );
}
