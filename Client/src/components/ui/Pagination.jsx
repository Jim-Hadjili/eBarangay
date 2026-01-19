import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="text-sm text-gray-600 font-Lexend">
        Showing {startIndex + 1}-{endIndex} of {totalItems}
      </div>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          disabled={currentPage === 1}
          className="p-2 text-gray-700 transition-all duration-200 bg-gray-100 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-9 h-9 cursor-pointer px-3 text-sm font-semibold rounded-lg transition-all duration-200 font-Lexend ${
                currentPage === page
                  ? "bg-green-600 text-white border border-green-600"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-700 transition-all duration-200 bg-gray-100 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
          aria-label="Next page"
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
