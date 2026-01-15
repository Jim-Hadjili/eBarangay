import OptionCard from "../../ui/OptionCard";

const ServiceOption = ({ service, selectedService, onSelect }) => {
  const isSelected = selectedService === service.id;

  return (
    <OptionCard
      title={service.name}
      description={service.description}
      icon={service.icon}
      selected={isSelected}
      onSelect={() => onSelect(service.id)}
    />
  );
};

export default ServiceOption;
