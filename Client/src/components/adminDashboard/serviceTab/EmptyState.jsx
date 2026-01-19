import { Plus, Briefcase } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
        <Briefcase className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900 font-Lexend">
        No Services Available
      </h3>
      <p className="mb-6 text-sm text-gray-600 font-Lexend">
        Get started by adding your first service
      </p>
      <button className="inline-flex gap-2 px-5 py-3 text-green-600 transition-all duration-200 bg-green-100 border-2 border-green-400 cursor-pointer group rounded-xl hover:shadow-lg hover:bg-green-200 font-Lexend whitespace-nowrap">
        <Plus
          size={20}
          strokeWidth={2.5}
          className="transition-transform duration-200 group-hover:rotate-90"
        />
        <span>Add New Service</span>
      </button>
    </div>
  );
}
