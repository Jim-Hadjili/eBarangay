import { useState } from "react";
import Header from "../components/ui/Header";
import EditProfileModal from "../components/modals/EditProfileModal";
import Pagination from "../components/ui/Pagination";
import {
  QueueHistoryHeader,
  QueueHistoryList,
  LoadingState,
  ErrorState,
  EmptyState,
} from "../components/queueHIstory";
import useQueueHistory from "../hooks/useQueueHistory";
import useQueueHistoryPage from "../hooks/useQueueHistoryPage";
import useEditProfile from "../hooks/useEditProfile";

export default function QueueHistory() {
  const {
    user,
    isEditProfileOpen,
    setIsEditProfileOpen,
    handleLogout,
    handleEditProfile,
    handleQueueHistory,
    handleBackToDashboard,
    handleBrowseServices,
    updateUserProfile,
  } = useQueueHistoryPage();

  const { queueHistory, loading, error } = useQueueHistory();
  const { updateProfile } = useEditProfile();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination values
  const totalItems = queueHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = queueHistory.slice(startIndex, endIndex);

  // Reset to page 1 when queue history changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveProfile = async (formData) => {
    try {
      const response = await updateProfile(formData);
      updateUserProfile(response.token);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <Header
        user={user}
        onLogout={handleLogout}
        onEditProfile={handleEditProfile}
        onQueueHistory={handleQueueHistory}
      />

      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-20">
        <div className="max-w-full mx-auto">
          <QueueHistoryHeader onBack={handleBackToDashboard} />

          {loading && <LoadingState />}

          {error && <ErrorState error={error} />}

          {!loading && !error && queueHistory.length === 0 && (
            <EmptyState onBrowseServices={handleBrowseServices} />
          )}

          {!loading && !error && queueHistory.length > 0 && (
            <>
              <QueueHistoryList queueHistory={currentItems} />

              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </>
  );
}
