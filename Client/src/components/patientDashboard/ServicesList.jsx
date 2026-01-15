import ServiceOption from "../features/queue/ServicesOption";

export default function ServicesList({
  services,
  loading,
  selectedService,
  onServiceClick,
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow flex-1">
      <h2 className="text-xl font-semibold mb-6">Select Healthcare Service</h2>
      {loading ? (
        <div>Loading services...</div>
      ) : services.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <span className="text-2xl mb-2 block">No services available</span>
          <span>Please check back later.</span>
        </div>
      ) : (
        <>
          {/* Mobile: Horizontal Carousel */}
          <div className="md:hidden overflow-x-auto scrollbar-hide -mx-8 px-8">
            <div className="flex gap-4 pb-4">
              {services.map((service) => (
                <div
                  key={service._id}
                  onClick={() => onServiceClick(service)}
                  className="cursor-pointer flex-shrink-0 w-[280px]"
                >
                  <ServiceOption
                    service={service}
                    selectedService={selectedService?._id}
                    onSelect={() => onServiceClick(service)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                onClick={() => onServiceClick(service)}
                className="cursor-pointer"
              >
                <ServiceOption
                  service={service}
                  selectedService={selectedService?._id}
                  onSelect={() => onServiceClick(service)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
