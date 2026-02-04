import { Plus } from "lucide-react";

export default function Header({ onAddClick }) {
  return (
    <>
      <div className="flex flex-col gap-4 mb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl font-Lexend">
            Admin Users Management
          </h2>
          <p className="text-sm text-gray-600 sm:text-base font-Lexend">
            Manage admin accounts and permissions
          </p>
        </div>
        <div className="w-full flex sm:w-auto sm:block">
          <button
            onClick={onAddClick}
            className="flex items-center justify-center gap-2 px-5 py-3 text-green-600 transition-all duration-200 bg-green-100 border-2 border-green-400 cursor-pointer group rounded-xl hover:shadow-lg hover:bg-green-200 font-Lexend whitespace-nowrap ml-auto w-auto sm:w-auto"
            style={{ minWidth: 0 }}
          >
            <Plus
              size={20}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:rotate-90"
            />
            <span className="text-sm sm:text-base">Add New Admin</span>
          </button>
        </div>
      </div>
    </>
  );
}
