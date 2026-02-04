import ServiceCardHeader from "./ServiceCardHeader";
import CurrentlyServingSection from "./CurrentlyServingSection";
import NextInQueueSection from "./NextInQueueSection";

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all w-full sm:w-[calc(50%-1rem)] lg:w-[calc(50%-1.5rem)] xl:w-[calc(100%-1.5rem)] min-w-[280px] max-w-[400px]">
      <ServiceCardHeader service={service} />
      <CurrentlyServingSection currentlyServing={service.currentlyServing} />
      <NextInQueueSection upcomingQueues={service.upcomingQueues} />
    </div>
  );
}
