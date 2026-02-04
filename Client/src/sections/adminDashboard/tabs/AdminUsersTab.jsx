import Header from "../../../components/adminDashboard/adminUserTab/Header";
import UserGrid from "../../../components/adminDashboard/adminUserTab/UserGrid";
import EmptyState from "../../../components/adminDashboard/adminUserTab/EmptyState";
import AddAdminUserModal from "../../../components/adminDashboard/adminUserTab/AddAdminUserModal";
import AdminProfileModal from "../../../components/modals/AdminProfileModal";
import Toast from "../../../components/ui/Toast";
import AdminUserSearchBar from "../../../components/adminDashboard/adminUserTab/AdminUserSearchBar";
import NoResults from "../../../components/adminDashboard/adminUserTab/NoResults";
import { useAdminUsersTab } from "../../../hooks/useAdminUsersTab";

export default function AdminUsersTab() {
  const {
    adminUsers,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    searchQuery,
    setSearchQuery,
    toast,
    handleCloseToast,
    handleAddSuccess,
    handleDeleteSuccess,
    filteredAdminUsers,
    currentUser,
    profileModal,
    handleProfileClick,
    handleCloseProfile,
  } = useAdminUsersTab();

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
        <Header onAddClick={() => setIsModalOpen(true)} />
        {adminUsers.length > 0 && (
          <AdminUserSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resultCount={filteredAdminUsers.length}
          />
        )}
        {filteredAdminUsers.length > 0 ? (
          <UserGrid
            adminUsers={filteredAdminUsers}
            currentUser={currentUser}
            onDeleteSuccess={handleDeleteSuccess}
            onProfileClick={handleProfileClick}
          />
        ) : searchQuery ? (
          <NoResults
            searchQuery={searchQuery}
            onClear={() => setSearchQuery("")}
          />
        ) : (
          <EmptyState onAddClick={() => setIsModalOpen(true)} />
        )}
      </div>
      <AddAdminUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
      <AdminProfileModal
        isOpen={profileModal.isOpen}
        onClose={handleCloseProfile}
        admin={profileModal.admin}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={handleCloseToast}
      />
    </div>
  );
}
