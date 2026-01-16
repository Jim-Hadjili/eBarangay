import OptionCard from "../../ui/OptionCard";
import { getServiceIcon } from "../../../utils/serviceIcons";

const ServiceOption = ({ service, selectedService, onSelect }) => {
  const isSelected = selectedService === service._id;
  const icon = getServiceIcon(service);

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
