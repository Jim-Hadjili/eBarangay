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
        <div className="flex items-center justify-between mb-6">
          <OverviewHeader />
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faChartBar} />
            <span className="hidden sm:inline">Generate Report</span>
            <span className="sm:hidden">Report</span>
          </button>
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
