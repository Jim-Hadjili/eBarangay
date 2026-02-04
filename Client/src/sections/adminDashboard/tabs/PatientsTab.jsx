import Header from "../../../components/adminDashboard/patientTab/Header";
import DesktopTable from "../../../components/adminDashboard/patientTab/DesktopTable";
import MobileTable from "../../../components/adminDashboard/patientTab/MobileTable";
import EmptyState from "../../../components/adminDashboard/patientTab/EmptyState";
import DeleteConfirmModal from "../../../components/ui/DeleteConfirmModal";
import Toast from "../../../components/ui/Toast";
import PatientSearchBar from "../../../components/adminDashboard/patientTab/PatientSearchBar";
import NoResults from "../../../components/adminDashboard/patientTab/NoResults";
import PatientMedicalHistoryModal from "../../../components/modals/PatientMedicalHistoryModal";
import ViewMedicalRecordModal from "../../../components/modals/ViewMedicalRecordModal";
import MedicalRecordModal from "../../../components/modals/MedicalRecordModal";
import PatientProfileModal from "../../../components/modals/PatientProfileModal";
import { usePatientsTab } from "../../../hooks/usePatientsTab";

export default function PatientsTab() {
  const {
    patients,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    deleteModal,
    setDeleteModal,
    handleDeleteClick,
    handleDeleteConfirm,
    deleteLoading,
    toast,
    handleCloseToast,
    filteredPatients,
    // Profile Modal
    profileModal,
    handleProfileClick,
    handleCloseProfile,
    // Medical Records
    handleViewClick,
    medicalHistoryModal,
    handleCloseMedicalHistory,
    records,
    recordsLoading,
    handleAddRecord,
    handleViewRecord,
    handleEditRecord,
    viewRecordModal,
    handleCloseViewRecord,
    recordFormModal,
    handleRecordFormSubmit,
    handleCloseRecordForm,
    recordFormLoading,
  } = usePatientsTab();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center w-full h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-600 font-Lexend">Loading Patient List...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
          <Header />
          <div className="flex items-center justify-center p-12 mt-10 text-center bg-white border border-red-200 shadow-sm rounded-xl">
            <p className="text-red-600 font-Lexend">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
        <Header />
        {patients.length > 0 && (
          <PatientSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resultCount={filteredPatients.length}
          />
        )}
        {filteredPatients.length > 0 ? (
          <>
            <DesktopTable
              patients={filteredPatients}
              onDelete={handleDeleteClick}
              onView={handleViewClick}
              onProfileClick={handleProfileClick}
            />
            <MobileTable
              patients={filteredPatients}
              onDelete={handleDeleteClick}
              onView={handleViewClick}
              onProfileClick={handleProfileClick}
            />
          </>
        ) : searchQuery ? (
          <NoResults
            searchQuery={searchQuery}
            onClear={() => setSearchQuery("")}
          />
        ) : (
          <EmptyState />
        )}
      </div>
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, patient: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        message="Are you sure you want to delete this patient? This will permanently remove all their data from the system."
        itemName={deleteModal.patient?.name}
        loading={deleteLoading}
      />
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={handleCloseToast}
      />
      <PatientProfileModal
        isOpen={profileModal.isOpen}
        onClose={handleCloseProfile}
        patient={profileModal.patient}
      />
      <PatientMedicalHistoryModal
        isOpen={medicalHistoryModal.isOpen}
        onClose={handleCloseMedicalHistory}
        patient={medicalHistoryModal.patient}
        records={records}
        loading={recordsLoading}
        onAddRecord={handleAddRecord}
        onViewRecord={handleViewRecord}
        onEditRecord={handleEditRecord}
      />
      <ViewMedicalRecordModal
        isOpen={viewRecordModal.isOpen}
        onClose={handleCloseViewRecord}
        record={viewRecordModal.record}
      />
      <MedicalRecordModal
        isOpen={recordFormModal.isOpen}
        onClose={handleCloseRecordForm}
        onSubmit={handleRecordFormSubmit}
        patient={medicalHistoryModal.patient}
        isLoading={recordFormLoading}
        actionType={recordFormModal.actionType}
        existingRecord={recordFormModal.existingRecord}
      />
    </div>
  );
}
