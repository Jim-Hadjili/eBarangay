import { User } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="p-12 mt-10 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
        <User className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900 font-Lexend">
        No Patients Found
      </h3>
      <p className="mb-6 text-sm text-gray-600 font-Lexend">
        Patient records will appear here once available.
      </p>
    </div>
  );
}
