import { useServicesTab } from "../../../hooks/useServicesTab";
import ServiceHeader from "../../../components/adminDashboard/serviceTab/ServiceHeader";
import DesktopTable from "../../../components/adminDashboard/serviceTab/DesktopTable";
import MobileTable from "../../../components/adminDashboard/serviceTab/MobileTable";
import EmptyState from "../../../components/adminDashboard/serviceTab/EmptyState";
import AddServiceModal from "../../../components/adminDashboard/serviceTab/AddServiceModal";
import EditServiceModal from "../../../components/ui/EditServiceModal";
import DeleteConfirmModal from "../../../components/ui/DeleteConfirmModal";
import Toast from "../../../components/ui/Toast";
import ServiceSearchBar from "../../../components/adminDashboard/serviceTab/ServiceSearchBar";
import NoResults from "../../../components/adminDashboard/serviceTab/NoResults";

export default function ServicesTab() {
  const {
    services,
    loading,
    error,
    isAddModalOpen,
    handleAddService,
    handleCloseModal,
    handleServiceAdded,
    searchQuery,
    setSearchQuery,
    editModal,
    handleEditClick,
    handleEditSave,
    handleEditCancel,
    updateLoading,
    deleteModal,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    deleteLoading,
    toast,
    handleCloseToast,
    filteredServices,
  } = useServicesTab();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center w-full h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-600 font-Lexend">Loading Services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
          <ServiceHeader onAddService={handleAddService} />
          <div className="p-12 text-center border border-red-200 bg-red-50 rounded-xl">
            <p className="text-red-600 font-Lexend">
              Error loading services: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
        <ServiceHeader onAddService={handleAddService} />
        {services.length > 0 && (
          <ServiceSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resultCount={filteredServices.length}
          />
        )}
        {filteredServices.length > 0 ? (
          <>
            <DesktopTable
              services={filteredServices}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
            <MobileTable
              services={filteredServices}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </>
        ) : searchQuery ? (
          <NoResults
            searchQuery={searchQuery}
            onClear={() => setSearchQuery("")}
          />
        ) : (
          <EmptyState onAddService={handleAddService} />
        )}
      </div>
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleServiceAdded}
      />
      <EditServiceModal
        isOpen={editModal.isOpen}
        onClose={handleEditCancel}
        onSave={handleEditSave}
        initialData={editModal.service}
        loading={updateLoading}
      />
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone and will remove all associated data."
        itemName={deleteModal.service?.name}
        loading={deleteLoading}
      />
      <Toast
        isVisible={toast.isVisible}
        onClose={handleCloseToast}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={5000}
        position="top-right"
      />
    </div>
  );
}
