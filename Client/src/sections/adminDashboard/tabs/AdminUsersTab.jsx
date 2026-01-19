// Client/src/sections/adminDashboard/tabs/AdminUsersTab.jsx
import { Plus, Edit, Trash2, Mail, Phone, User } from "lucide-react";

export default function AdminUsersTab() {
  const adminUsers = [
    {
      id: 1,
      name: "Maria Santos",
      email: "maria.santos@ebarangay.com",
      phone: "0912-345-6789",
      role: "Super Admin",
      status: "active",
    },
    {
      id: 2,
      name: "Jose Reyes",
      email: "jose.reyes@ebarangay.com",
      phone: "0923-456-7890",
      role: "Admin",
      status: "active",
    },
    {
      id: 3,
      name: "Ana Cruz",
      email: "ana.cruz@ebarangay.com",
      phone: "0934-567-8901",
      role: "Admin",
      status: "inactive",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl font-Lexend">
              Admin Users Management
            </h2>
            <p className="text-sm text-gray-600 sm:text-base font-Lexend">
              Manage admin accounts and permissions
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-3 font-semibold text-white transition-all duration-200 shadow-md group bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:from-green-600 hover:to-green-700 font-Lexend whitespace-nowrap">
            <Plus
              size={20}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:rotate-90"
            />
            <span className="text-sm sm:text-base">Add Admin User</span>
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {adminUsers.map((admin, idx) => (
            <div
              key={admin.id}
              className="relative flex flex-col overflow-hidden transition-shadow duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-lg"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Status badge */}
              <span
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold font-Lexend z-10 ${
                  admin.status === "active"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {admin.status}
              </span>

              {/* Card Content */}
              <div className="flex flex-col flex-1 p-6">
                {/* Avatar and Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center text-xl font-bold text-white rounded-full shadow-md w-14 h-14 bg-gradient-to-br from-green-400 to-green-600">
                    {admin.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 font-Lexend">
                      {admin.name}
                    </h3>
                    <span className="text-sm font-medium text-gray-500 font-Lexend">
                      {admin.role}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                    <Mail size={16} />
                    <span className="truncate">{admin.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                    <Phone size={16} />
                    <span>{admin.phone}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 mt-auto border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-blue-700 font-semibold bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-Lexend">
                    <Edit size={18} strokeWidth={2} />
                    <span>Edit</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-red-700 font-semibold bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 font-Lexend">
                    <Trash2 size={18} strokeWidth={2} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {adminUsers.length === 0 && (
          <div className="p-12 mt-10 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900 font-Lexend">
              No Admin Users
            </h3>
            <p className="mb-6 text-sm text-gray-600 font-Lexend">
              Get started by adding your first admin user
            </p>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-Lexend">
              <Plus size={20} strokeWidth={2.5} />
              <span>Add Admin User</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
