import { useState } from "react";
import { Search } from "lucide-react";
import { useServices } from "../../../hooks/useServices";
import { useDeleteService } from "../../../hooks/useDeleteService";
import { useUpdateService } from "../../../hooks/useUpdateService";
import ServiceHeader from "../../../components/adminDashboard/serviceTab/ServiceHeader";
import DesktopTable from "../../../components/adminDashboard/serviceTab/DesktopTable";
import MobileTable from "../../../components/adminDashboard/serviceTab/MobileTable";
import EmptyState from "../../../components/adminDashboard/serviceTab/EmptyState";
import AddServiceModal from "../../../components/adminDashboard/serviceTab/AddServiceModal";
import EditServiceModal from "../../../components/ui/EditServiceModal";
import DeleteConfirmModal from "../../../components/ui/DeleteConfirmModal";
import Toast from "../../../components/ui/Toast";

export default function ServicesTab() {
  const { services, loading, error } = useServices();
  const { deleteService, loading: deleteLoading } = useDeleteService();
  const { updateService, loading: updateLoading } = useUpdateService();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editModal, setEditModal] = useState({
    isOpen: false,
    service: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    service: null,
  });
  const [toast, setToast] = useState({
    isVisible: false,
    type: "success",
    title: "",
    message: "",
  });

  const handleAddService = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleServiceAdded = (serviceName) => {
    setToast({
      isVisible: true,
      type: "success",
      title: "Service Added Successfully!",
      message: `${serviceName} has been added to the system.`,
    });
  };

  const handleEditClick = (service) => {
    setEditModal({
      isOpen: true,
      service,
    });
  };

  const handleEditSave = async (updatedData) => {
    if (!editModal.service) return;

    const result = await updateService(
      editModal.service.identifier,
      updatedData
    );

    if (result.success) {
      setToast({
        isVisible: true,
        type: "success",
        title: "Service Updated!",
        message: `${updatedData.name} has been updated successfully.`,
      });
      setEditModal({ isOpen: false, service: null });
    } else {
      setToast({
        isVisible: true,
        type: "error",
        title: "Update Failed",
        message: result.error || "Failed to update service.",
      });
    }
  };

  const handleEditCancel = () => {
    if (!updateLoading) {
      setEditModal({ isOpen: false, service: null });
    }
  };

  const handleDeleteClick = (service) => {
    setDeleteModal({
      isOpen: true,
      service,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.service) return;

    const result = await deleteService(deleteModal.service.identifier);

    if (result.success) {
      setToast({
        isVisible: true,
        type: "success",
        title: "Service Deleted!",
        message: `${deleteModal.service.name} has been removed from the system.`,
      });
      setDeleteModal({ isOpen: false, service: null });
    } else {
      setToast({
        isVisible: true,
        type: "error",
        title: "Delete Failed",
        message: result.error || "Failed to delete service.",
      });
    }
  };

  const handleDeleteCancel = () => {
    if (!deleteLoading) {
      setDeleteModal({ isOpen: false, service: null });
    }
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Filter services based on search query
  const filteredServices = services.filter((service) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      service.name.toLowerCase().includes(searchLower) ||
      service.identifier.toLowerCase().includes(searchLower) ||
      service.status.toLowerCase().includes(searchLower)
    );
  });

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

        {/* Search Bar */}
        {services.length > 0 && (
          <div className="flex items-center justify-end mb-6">
            <div className="w-full sm:w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, code, or status..."
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
                  Found {filteredServices.length} result
                  {filteredServices.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
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
          <div className="p-12 mt-10 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900 font-Lexend">
              No Results Found
            </h3>
            <p className="mb-6 text-sm text-gray-600 font-Lexend">
              No services match your search "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-green-600 font-semibold bg-green-100 border-2 border-green-400 rounded-lg hover:bg-green-200 transition-all duration-200 font-Lexend"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <EmptyState onAddService={handleAddService} />
        )}
      </div>

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleServiceAdded}
      />

      {/* Edit Service Modal */}
      <EditServiceModal
        isOpen={editModal.isOpen}
        onClose={handleEditCancel}
        onSave={handleEditSave}
        initialData={editModal.service}
        loading={updateLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone and will remove all associated data."
        itemName={deleteModal.service?.name}
        loading={deleteLoading}
      />

      {/* Toast Notification */}
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
