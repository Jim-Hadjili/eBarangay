import ServiceOption from "../features/queue/ServicesOption";

export default function ServicesList({
  services,
  loading,
  selectedService,
  onServiceClick,
}) {
  return (
    <div className="flex-1 p-8 bg-white border border-gray-200 md:p-12 rounded-2xl drop-shadow-md">
      <h2 className="mb-6 -ml-4 text-xl font-Lexend lg:text-3xl md:ml-0">
        Select Healthcare Service
      </h2>
      {loading ? (
        <div>Loading services...</div>
      ) : services.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <span className="block mb-2 text-2xl">No services available</span>
          <span>Please check back later.</span>
        </div>
      ) : (
        <>
          {/* Mobile: Horizontal Carousel */}
          <div className="py-2 -mx-4 overflow-x-auto md:hidden scrollbar-hide">
            <div className="flex gap-4 pb-4">
              {services.map((service) => {
                const isDisabled =
                  service.status === "full" || service.status === "unavailable";
                return (
                  <div
                    key={service._id}
                    onClick={() => !isDisabled && onServiceClick(service)}
                    className={isDisabled ? "" : "cursor-pointer shrink-0 w-70"}
                  >
                    <ServiceOption
                      service={service}
                      selectedService={selectedService?._id}
                      onSelect={() => !isDisabled && onServiceClick(service)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden grid-cols-1 gap-6 md:grid md:grid-cols-3">
            {services.map((service) => {
              const isDisabled =
                service.status === "full" || service.status === "unavailable";
              return (
                <div
                  key={service._id}
                  onClick={() => !isDisabled && onServiceClick(service)}
                  className={isDisabled ? "" : "cursor-pointer"}
                >
                  <ServiceOption
                    service={service}
                    selectedService={selectedService?._id}
                    onSelect={() => !isDisabled && onServiceClick(service)}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
