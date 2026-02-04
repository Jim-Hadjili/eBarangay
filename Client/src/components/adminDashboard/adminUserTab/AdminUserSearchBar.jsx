import { Search } from "lucide-react";

export default function AdminUserSearchBar({
  searchQuery,
  setSearchQuery,
  resultCount,
}) {
  return (
    <div className="flex items-center justify-end mb-6">
      <div className="w-full sm:w-96">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-12 pr-4 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-right text-gray-600 font-Lexend">
            Found {resultCount} result{resultCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
