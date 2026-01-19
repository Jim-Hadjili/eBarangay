import { useEffect } from "react";
import { X, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

export default function Toast({
  isVisible,
  onClose,
  type = "success",
  title,
  message,
  duration = 5000,
  position = "top-right",
}) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      iconColor: "text-green-600",
      titleColor: "text-green-900",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-500",
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-900",
    },
  };

  const config = typeConfig[type] || typeConfig.success;
  const Icon = config.icon;

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 animate-slide-in-right`}
    >
      <div
        className={`flex items-start gap-3 min-w-[320px] max-w-md p-4 rounded-lg shadow-lg border-l-4 ${config.bgColor} ${config.borderColor}`}
      >
        <div className={`shrink-0 ${config.iconColor}`}>
          <Icon size={24} strokeWidth={2} />
        </div>
        <div className="flex-1">
          <h4
            className={`text-sm font-bold font-Lexend mb-1 ${config.titleColor}`}
          >
            {title}
          </h4>
          {message && (
            <p className="text-sm text-gray-700 font-Lexend">{message}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 transition-colors shrink-0 hover:text-gray-700"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
