export default function OverviewCard({
  title,
  value,
  icon: Icon,
  description,
  descriptionColor = "text-gray-500",
}) {
  return (
    <div className="relative overflow-hidden transition-all duration-300 ease-in-out bg-white border border-gray-200 shadow-sm group rounded-xl hover:shadow-lg hover:border-gray-300">
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-0 w-full h-1 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-green-400 to-green-600 group-hover:opacity-100" />

      <div className="p-5 sm:p-6">
        {/* Header with title and icon */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs font-semibold tracking-wide text-gray-600 uppercase sm:text-sm font-Lexend">
            {title}
          </h3>
          {Icon && (
            <div className="flex items-center justify-center w-10 h-10 text-green-600 transition-colors duration-300 rounded-lg sm:w-12 sm:h-12 bg-gradient-to-br from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-200">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
            </div>
          )}
        </div>

        {/* Value */}
        <p className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl sm:mb-3 font-Lexend">
          {value}
        </p>

        {/* Description */}
        <p
          className={`text-xs sm:text-sm font-medium ${descriptionColor} font-Lexend`}
        >
          {description}
        </p>
      </div>

      {/* Subtle hover effect background */}
      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 pointer-events-none bg-gradient-to-br from-transparent to-gray-50 group-hover:opacity-30" />
    </div>
  );
}
