import { useDashboard } from "./useDashboard";
import { useActivity } from "./useActivity";

export function useOverviewTab() {
  const { stats, loading, error } = useDashboard();
  const { activities, loading: activitiesLoading } = useActivity(10);

  const overviewData = [
    {
      title: "Total Patients",
      value: loading ? "..." : stats.totalPatients.toLocaleString(),
      icon: "Users",
      description: "Registered patients",
      descriptionColor: "text-blue-600",
    },
    {
      title: "Active Services",
      value: loading ? "..." : stats.activeServices,
      icon: "Briefcase",
      description: "Available services",
      descriptionColor: "text-purple-600",
    },
    {
      title: "Queue Today",
      value: loading ? "..." : stats.queueToday,
      icon: "Clock",
      description: "Total queues today",
      descriptionColor: "text-orange-600",
    },
    {
      title: "Total Staff Available",
      value: loading ? "..." : stats.totalStaff,
      icon: "UserCog",
      description: "Active staff members",
      descriptionColor: "text-green-600",
    },
  ];

  return {
    overviewData,
    error,
    activities,
    activitiesLoading,
  };
}
