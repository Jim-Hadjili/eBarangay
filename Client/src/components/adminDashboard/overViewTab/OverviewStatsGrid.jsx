import OverviewCard from "../../ui/OverviewCard";
import { Users, Briefcase, Clock, UserCog } from "lucide-react";

const iconMap = { Users, Briefcase, Clock, UserCog };

export default function OverviewStatsGrid({ overviewData }) {
  return (
    <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 lg:gap-6 sm:mb-10 lg:mb-12">
      {overviewData.map((card) => (
        <OverviewCard key={card.title} {...card} icon={iconMap[card.icon]} />
      ))}
    </div>
  );
}
