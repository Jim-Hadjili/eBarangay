import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServiceIcon } from "../../utils/serviceIcons";

export default function ServiceCardHeader({ service }) {
  return (
    <div className="bg-green-500 text-white py-3 sm:py-4 lg:py-5 px-4 sm:px-5 lg:px-6 flex justify-between items-center gap-3">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
        <FontAwesomeIcon
          icon={getServiceIcon(service)}
          className="text-2xl sm:text-3xl lg:text-4xl opacity-95 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold leading-tight truncate">
            {service.name}
          </h2>
        </div>
      </div>
      <div className="text-center min-w-12.5 sm:min-w-15 lg:min-w-17.5 shrink-0">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-none mb-0.5 sm:mb-1">
          {service.waitingCount || 0}
        </div>
        <div className="text-xs sm:text-sm opacity-90 font-medium">Waiting</div>
      </div>
    </div>
  );
}
