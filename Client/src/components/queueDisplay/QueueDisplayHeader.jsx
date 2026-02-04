import { formatTime, formatDate } from "../../utils/queueDisplayHelpers";

export default function QueueDisplayHeader({ currentTime }) {
  return (
    <header className="bg-blue-600 text-white py-3 sm:py-4 lg:py-6 px-4 sm:px-8 lg:px-12 shadow-md shrink-0">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
          <img
            src="/images/Logo.png"
            alt="eBarangay Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-1 sm:mb-2">
              eBarangay Healthcare
            </h1>
          </div>
        </div>
        <div className="text-center sm:text-right">
          <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-none mb-0.5 sm:mb-1">
            {formatTime(currentTime)}
          </div>
          <p className="text-xs sm:text-sm lg:text-base opacity-95">
            {formatDate(currentTime)}
          </p>
        </div>
      </div>
    </header>
  );
}
