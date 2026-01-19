// Client/src/sections/adminDashboard/tabs/AdminUsersTab.jsx
import { useState } from "react";
import { Search } from "lucide-react";
import Header from "../../../components/adminDashboard/adminUserTab/Header";
import UserGrid from "../../../components/adminDashboard/adminUserTab/UserGrid";
import EmptyState from "../../../components/adminDashboard/adminUserTab/EmptyState";
import AddAdminUserModal from "../../../components/adminDashboard/adminUserTab/AddAdminUserModal";
import Toast from "../../../components/ui/Toast";
import { useAdminUsers } from "../../../hooks/useAdminUsers";
import { getToken, getUserFromToken } from "../../../utils/session";

export default function AdminUsersTab() {
  const { adminUsers, loading, error, refetch } = useAdminUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Get current user from token
  const token = getToken();
  const currentUser = getUserFromToken(token);

  const handleAddSuccess = (userName) => {
    setToast({
      show: true,
      message: `${userName} has been added successfully!`,
      type: "success",
    });
    refetch();
  };

  const handleDeleteSuccess = (userName) => {
    setToast({
      show: true,
      message: `${userName} has been deleted successfully!`,
      type: "success",
    });
    refetch();
  };

  // Filter admin users based on search query
  const filteredAdminUsers = adminUsers.filter((admin) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      admin.name.toLowerCase().includes(searchLower) ||
      admin.email.toLowerCase().includes(searchLower) ||
      admin.role.toLowerCase().includes(searchLower) ||
      (admin.phone && admin.phone.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center w-full h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-600 font-Lexend">Loading Admin List...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center w-full h-screen">
          <div className="p-6 text-center border border-red-200 bg-red-50 rounded-xl">
            <p className="text-red-600 font-Lexend">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
        {/* Header */}
        <Header onAddClick={() => setIsModalOpen(true)} />

        {/* Search Bar */}
        {adminUsers.length > 0 && (
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
                  Found {filteredAdminUsers.length} result
                  {filteredAdminUsers.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Cards Grid or Empty State */}
        {filteredAdminUsers.length > 0 ? (
          <UserGrid
            adminUsers={filteredAdminUsers}
            currentUser={currentUser}
            onDeleteSuccess={handleDeleteSuccess}
          />
        ) : searchQuery ? (
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
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-green-600 font-semibold bg-green-100 border-2 border-green-400 rounded-lg hover:bg-green-200 transition-all duration-200 font-Lexend"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <EmptyState onAddClick={() => setIsModalOpen(true)} />
        )}
      </div>

      {/* Add Admin User Modal */}
      <AddAdminUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
