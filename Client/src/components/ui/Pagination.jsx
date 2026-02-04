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

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 6; // Maximum number of slots including ellipsis

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 2) {
        // Near start: 1 2 3 ... 10
        pages.push(2);
        pages.push(3);
        pages.push("ellipsis-end");
      } else if (currentPage >= totalPages - 1) {
        // Near end: 1 ... 8 9 10
        pages.push("ellipsis-start");
        pages.push(totalPages - 2);
        pages.push(totalPages - 1);
      } else {
        // In middle: 1 ... 5 ... 10
        pages.push("ellipsis-start");
        pages.push(currentPage);
        pages.push("ellipsis-end");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center md:justify-between p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="text-sm md:inline hidden text-gray-600 font-Lexend">
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
          {pageNumbers.map((page, index) => {
            if (typeof page === "string" && page.startsWith("ellipsis")) {
              return (
                <span
                  key={page}
                  className="min-w-9 h-9 px-3 flex items-center justify-center text-gray-500 font-semibold"
                >
                  ...
                </span>
              );
            }

            return (
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
            );
          })}
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
