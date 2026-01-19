import { useServices } from "../../../hooks/useServices";
import ServiceHeader from "../../../components/adminDashboard/serviceTab/ServiceHeader";
import DesktopTable from "../../../components/adminDashboard/serviceTab/DesktopTable";
import MobileTable from "../../../components/adminDashboard/serviceTab/MobileTable";
import EmptyState from "../../../components/adminDashboard/serviceTab/EmptyState";

export default function ServicesTab() {
  const { services, loading, error } = useServices();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
          <ServiceHeader />
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
              <p className="mt-4 text-gray-600 font-Lexend">
                Loading services...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
          <ServiceHeader />
          <div className="p-12 text-center border border-red-200 bg-red-50 rounded-xl">
            <p className="text-red-600 font-Lexend">
              Error loading services: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
        <ServiceHeader />
        {services.length > 0 ? (
          <>
            <DesktopTable services={services} />
            <MobileTable services={services} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
