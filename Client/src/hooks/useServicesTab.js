import { useState } from "react";
import { useServices } from "./useServices";
import { useDeleteService } from "./useDeleteService";
import { useUpdateService } from "./useUpdateService";

export function useServicesTab() {
  const { services, loading, error } = useServices();
  const { deleteService, loading: deleteLoading } = useDeleteService();
  const { updateService, loading: updateLoading } = useUpdateService();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editModal, setEditModal] = useState({ isOpen: false, service: null });
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

  const handleAddService = () => setIsAddModalOpen(true);
  const handleCloseModal = () => setIsAddModalOpen(false);

  const handleServiceAdded = (serviceName) => {
    setToast({
      isVisible: true,
      type: "success",
      title: "Service Added Successfully!",
      message: `${serviceName} has been added to the system.`,
    });
  };

  const handleEditClick = (service) => setEditModal({ isOpen: true, service });
  const handleEditSave = async (updatedData) => {
    if (!editModal.service) return;
    const result = await updateService(
      editModal.service.identifier,
      updatedData,
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
    if (!updateLoading) setEditModal({ isOpen: false, service: null });
  };

  const handleDeleteClick = (service) =>
    setDeleteModal({ isOpen: true, service });
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
    if (!deleteLoading) setDeleteModal({ isOpen: false, service: null });
  };

  const handleCloseToast = () =>
    setToast((prev) => ({ ...prev, isVisible: false }));

  // Filter services based on search query
  const filteredServices = services.filter((service) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      service.name.toLowerCase().includes(searchLower) ||
      service.identifier.toLowerCase().includes(searchLower) ||
      service.status.toLowerCase().includes(searchLower)
    );
  });

  return {
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
    setEditModal,
    handleEditClick,
    handleEditSave,
    handleEditCancel,
    updateLoading,
    deleteModal,
    setDeleteModal,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    deleteLoading,
    toast,
    handleCloseToast,
    filteredServices,
  };
}
