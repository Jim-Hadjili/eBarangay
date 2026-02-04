import { Search } from "lucide-react";

export default function NoResults({ searchQuery, onClear }) {
  return (
    <div className="p-12 mt-10 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
        <Search className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900 font-Lexend">
        No Results Found
      </h3>
      <p className="mb-6 text-sm text-gray-600 font-Lexend">
        No admin users match your search "{searchQuery}"
      </p>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-green-600 cursor-pointer bg-green-100 border-2 border-green-400 rounded-lg hover:bg-green-200 transition-all duration-200 font-Lexend"
      >
        Clear Search
      </button>
    </div>
  );
}
