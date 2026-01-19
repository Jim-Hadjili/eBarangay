import {
  UserPlus,
  Clock,
  Shield,
  Briefcase,
  CheckCircle,
  XCircle,
  LogIn,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const activityIcons = {
  patient_registered: {
    icon: UserPlus,
    color: "text-blue-600",
    bg: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  admin_added: {
    icon: Shield,
    color: "text-purple-600",
    bg: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  staff_added: {
    icon: Users,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
  queue_joined: {
    icon: Clock,
    color: "text-orange-600",
    bg: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  queue_completed: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    borderColor: "border-green-200",
  },
  queue_cancelled: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    borderColor: "border-red-200",
  },
  service_created: {
    icon: Briefcase,
    color: "text-teal-600",
    bg: "bg-teal-50",
    borderColor: "border-teal-200",
  },
  service_updated: {
    icon: Briefcase,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    borderColor: "border-cyan-200",
  },
  service_disabled: {
    icon: Briefcase,
    color: "text-gray-600",
    bg: "bg-gray-50",
    borderColor: "border-gray-200",
  },
  user_login: {
    icon: LogIn,
    color: "text-gray-600",
    bg: "bg-gray-50",
    borderColor: "border-gray-200",
  },
};

export default function ActivityItem({ activity }) {
  const activityConfig = activityIcons[activity.activityType] || {
    icon: Clock,
    color: "text-gray-600",
    bg: "bg-gray-50",
    borderColor: "border-gray-200",
  };

  const Icon = activityConfig.icon;

  const timeAgo = formatDistanceToNow(new Date(activity.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="flex items-start gap-3 px-3 py-3 transition-all duration-200 border-b rounded-lg group sm:gap-4 sm:py-4 sm:px-4 last:border-b-0 hover:bg-gray-50">
      {/* Icon Container */}
      <div
        className={`shrink-0 p-2 sm:p-2.5 rounded-lg ${activityConfig.bg} border ${activityConfig.borderColor} group-hover:scale-110 transition-transform duration-200`}
      >
        <Icon
          className={`${activityConfig.color} w-4 h-4 sm:w-5 sm:h-5`}
          strokeWidth={2}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="mb-1 text-sm font-medium leading-snug text-gray-900 sm:text-base font-Lexend">
          {activity.description}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <p className="text-xs text-gray-500 sm:text-sm font-Lexend">
            {timeAgo}
          </p>
        </div>
      </div>
    </div>
  );
}
