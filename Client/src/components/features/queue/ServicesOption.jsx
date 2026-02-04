import OptionCard from "../../ui/OptionCard";
import { getServiceIcon } from "../../../utils/serviceIcons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUserSlash } from "@fortawesome/free-solid-svg-icons";

const ServiceOption = ({ service, selectedService, onSelect }) => {
  const isSelected = selectedService === service._id;
  const icon = getServiceIcon(service);
  const isFull = service.status === "full";
  const isUnavailable = service.status === "unavailable";
  const isDisabled = isFull || isUnavailable;

  // If the service is full or unavailable, show a custom disabled card
  if (isDisabled) {
    return (
      <div
        className={`
          w-full h-full min-h-35 p-5 rounded-xl border relative
          bg-gray-50 border-gray-300 opacity-75 cursor-not-allowed
        `}
      >
        {/* Status badge - Top Right */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
              isFull
                ? "bg-amber-100 text-amber-800 border border-amber-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            <FontAwesomeIcon
              icon={isFull ? faLock : faUserSlash}
              className="text-xs"
            />
            {isFull ? "Queue Full" : "Unavailable"}
          </span>
        </div>

        <div className="flex flex-col items-start gap-4 h-full">
          {/* Icon with overlay */}
          <div className="relative">
            <div className="p-2 rounded-lg bg-gray-400 text-white">
              <FontAwesomeIcon icon={icon} size="lg" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-700">{service.name}</h3>
            {service.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {service.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal active service card
  return (
    <OptionCard
      title={service.name}
      description={service.description}
      icon={icon}
      selected={isSelected}
      onSelect={() => onSelect(service._id)}
    />
  );
};

export default ServiceOption;
