import Header from "../components/ui/Header";
import EditProfileModal from "../components/modals/EditProfileModal";
import Pagination from "../components/ui/Pagination";
import {
  MedicalHistoryHeader,
  MedicalRecordsGrid,
  LoadingState,
  EmptyState,
  ErrorState,
} from "../components/medicalHistory";
import { useMedicalHistory } from "../hooks/useMedicalHistory";

export default function MedicalHistory() {
  const {
    user,
    records,
    totalRecords,
    loading,
    error,
    isEditProfileOpen,
    currentPage,
    totalPages,
    itemsPerPage,
    handleLogout,
    handleEditProfile,
    handleQueueHistory,
    handleBack,
    handleSaveProfile,
    handleCloseEditProfile,
    handleRetry,
    handlePageChange,
  } = useMedicalHistory();

  return (
    <>
      <Header
        user={user}
        onLogout={handleLogout}
        onEditProfile={handleEditProfile}
        onQueueHistory={handleQueueHistory}
      />

      <section className="w-full px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 lg:px-20 lg:py-10">
        <MedicalHistoryHeader onBack={handleBack} />

        {loading && <LoadingState />}

        {error && !loading && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}

        {!loading && !error && records.length === 0 && <EmptyState />}

        {!loading && !error && records.length > 0 && (
          <>
            <MedicalRecordsGrid records={records} />

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalRecords}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </section>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={handleCloseEditProfile}
        user={user}
        onSave={handleSaveProfile}
      />
    </>
  );
}
