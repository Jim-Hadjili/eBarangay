import { useState } from "react";
import OverviewHeader from "../../../components/adminDashboard/overViewTab/OverviewHeader";
import OverviewStatsGrid from "../../../components/adminDashboard/overViewTab/OverviewStatsGrid";
import RecentActivitySection from "../../../components/adminDashboard/overViewTab/RecentActivitySection";
import ErrorAlert from "../../../components/adminDashboard/overViewTab/ErrorAlert";
import GenerateReportModal from "../../../components/modals/GenerateReportModal";
import { useOverviewTab } from "../../../hooks/useOverviewTab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";

export default function OverviewTab() {
  const { overviewData, error, activities, activitiesLoading } =
    useOverviewTab();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
          <OverviewHeader />
          <div className="w-full flex sm:w-auto sm:block">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 text-blue-600 transition-all duration-200 bg-blue-100 border-2 border-blue-400 cursor-pointer group rounded-xl hover:shadow-lg hover:bg-blue-200 font-Lexend whitespace-nowrap ml-auto w-auto sm:w-auto"
              style={{ minWidth: 0 }}
            >
              <FontAwesomeIcon
                icon={faChartBar}
                className="sm:w-5 sm:h-5 transition-transform duration-200 group-hover:-translate-x-1"
              />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
        <ErrorAlert error={error} />
        <OverviewStatsGrid overviewData={overviewData} />
        <RecentActivitySection
          activities={activities}
          loading={activitiesLoading}
        />
      </div>

      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
