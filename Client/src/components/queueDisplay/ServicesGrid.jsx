import ServiceCard from "./ServiceCard";

export default function ServicesGrid({ servicesWithQueues }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 max-w-full px-2">
      {servicesWithQueues.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}
