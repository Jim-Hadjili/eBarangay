import Header from "../components/ui/Header";
import EditProfileModal from "../components/modals/EditProfileModal";
import {
  BackButton,
  LoadingState,
  ErrorState,
  RecordContent,
} from "../components/MedicalRecordDetails";
import { useMedicalRecordDetails } from "../hooks/useMedicalRecordDetails";

export default function MedicalRecordDetails() {
  const {
    user,
    record,
    loading,
    error,
    isEditProfileOpen,
    handleLogout,
    handleEditProfile,
    handleQueueHistory,
    handleBack,
    handleSaveProfile,
    handleCloseEditProfile,
  } = useMedicalRecordDetails();

  if (loading) {
    return (
      <>
        <Header
          user={user}
          onLogout={handleLogout}
          onEditProfile={handleEditProfile}
          onQueueHistory={handleQueueHistory}
        />
        <LoadingState />
      </>
    );
  }

  if (error || !record) {
    return (
      <>
        <Header
          user={user}
          onLogout={handleLogout}
          onEditProfile={handleEditProfile}
          onQueueHistory={handleQueueHistory}
        />
        <ErrorState error={error} onBack={handleBack} />
      </>
    );
  }

  return (
    <>
      <Header
        user={user}
        onLogout={handleLogout}
        onEditProfile={handleEditProfile}
        onQueueHistory={handleQueueHistory}
      />

      <section className="w-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-16 xl:px-20 lg:py-10">
        <BackButton onClick={handleBack} text="Back to Medical History" />
        <RecordContent record={record} />
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
