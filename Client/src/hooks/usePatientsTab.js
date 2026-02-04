import { useState } from "react";
import { usePatients } from "./usePatients";
import { useDeletePatient } from "./useDeletePatient";
import { usePatientMedicalRecords } from "./usePatientMedicalRecords";

export function usePatientsTab() {
  const { patients, loading, error, refetch } = usePatients();
  const { deletePatient, loading: deleteLoading } = useDeletePatient();
  const {
    records,
    loading: recordsLoading,
    fetchRecords,
    fetchSingleRecord,
    createRecord,
    updateRecord,
  } = usePatientMedicalRecords();

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    patient: null,
  });
  const [profileModal, setProfileModal] = useState({
    isOpen: false,
    patient: null,
  });
  const [medicalHistoryModal, setMedicalHistoryModal] = useState({
    isOpen: false,
    patient: null,
  });
  const [viewRecordModal, setViewRecordModal] = useState({
    isOpen: false,
    record: null,
  });
  const [recordFormModal, setRecordFormModal] = useState({
    isOpen: false,
    actionType: "add", // 'add' or 'edit'
    existingRecord: null,
  });
  const [recordFormLoading, setRecordFormLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleDeleteClick = (patient) =>
    setDeleteModal({ isOpen: true, patient });

  const handleProfileClick = (patient) =>
    setProfileModal({ isOpen: true, patient });

  const handleCloseProfile = () =>
    setProfileModal({ isOpen: false, patient: null });

  const handleViewClick = async (patient) => {
    setMedicalHistoryModal({ isOpen: true, patient });
    await fetchRecords(patient.id);
  };

  const handleCloseMedicalHistory = () => {
    setMedicalHistoryModal({ isOpen: false, patient: null });
  };

  const handleAddRecord = () => {
    setRecordFormModal({
      isOpen: true,
      actionType: "add",
      existingRecord: null,
    });
  };

  const handleViewRecord = async (record) => {
    try {
      const fullRecord = await fetchSingleRecord(record._id);
      setViewRecordModal({ isOpen: true, record: fullRecord });
    } catch (err) {
      setToast({
        show: true,
        message: "Failed to load record details",
        type: "error",
      });
    }
  };

  const handleEditRecord = async (record) => {
    try {
      const fullRecord = await fetchSingleRecord(record._id);
      setViewRecordModal({ isOpen: false, record: null });
      setRecordFormModal({
        isOpen: true,
        actionType: "edit",
        existingRecord: fullRecord,
      });
    } catch (err) {
      setToast({
        show: true,
        message: "Failed to load record for editing",
        type: "error",
      });
    }
  };

  const handleRecordFormSubmit = async (formData) => {
    setRecordFormLoading(true);
    try {
      if (recordFormModal.actionType === "add") {
        // Create new record with patientId and serviceId
        if (!formData.serviceId) {
          setToast({
            show: true,
            message: "Please select a service",
            type: "error",
          });
          setRecordFormLoading(false);
          return;
        }

        await createRecord({
          patientId: medicalHistoryModal.patient.id,
          serviceId: formData.serviceId,
          chiefComplaint: formData.chiefComplaint,
          vitalSigns: formData.vitalSigns,
          diagnosis: formData.diagnosis,
          treatmentNotes: formData.treatmentNotes,
          prescriptions: formData.prescriptions,
          additionalNotes: formData.additionalNotes,
        });

        setToast({
          show: true,
          message: "Medical record created successfully!",
          type: "success",
        });
        setRecordFormModal({
          isOpen: false,
          actionType: "add",
          existingRecord: null,
        });
        // Refresh records
        if (medicalHistoryModal.patient) {
          await fetchRecords(medicalHistoryModal.patient.id);
        }
      } else {
        // Edit existing record
        await updateRecord(recordFormModal.existingRecord._id, formData);
        setToast({
          show: true,
          message: "Medical record updated successfully!",
          type: "success",
        });
        setRecordFormModal({
          isOpen: false,
          actionType: "add",
          existingRecord: null,
        });
        // Refresh records
        if (medicalHistoryModal.patient) {
          await fetchRecords(medicalHistoryModal.patient.id);
        }
      }
    } catch (err) {
      setToast({
        show: true,
        message: err.message || "Failed to save medical record",
        type: "error",
      });
    } finally {
      setRecordFormLoading(false);
    }
  };

  const handleCloseRecordForm = () => {
    if (!recordFormLoading) {
      setRecordFormModal({
        isOpen: false,
        actionType: "add",
        existingRecord: null,
      });
    }
  };

  const handleCloseViewRecord = () => {
    setViewRecordModal({ isOpen: false, record: null });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePatient(deleteModal.patient.id);
      setDeleteModal({ isOpen: false, patient: null });
      setToast({
        show: true,
        message: `${deleteModal.patient.name} has been deleted successfully!`,
        type: "success",
      });
      refetch();
    } catch (err) {
      setToast({
        show: true,
        message: err.message || "Failed to delete patient",
        type: "error",
      });
    }
  };

  const handleCloseToast = () => setToast((prev) => ({ ...prev, show: false }));

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower) ||
      (patient.phone && patient.phone.toLowerCase().includes(searchLower)) ||
      (patient.gender && patient.gender.toLowerCase().includes(searchLower)) ||
      (patient.address && patient.address.toLowerCase().includes(searchLower))
    );
  });

  return {
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
  };
}
