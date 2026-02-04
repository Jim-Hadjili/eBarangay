import { useCallback, useMemo, useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { useMedicalRecordForm } from "../../hooks/useMedicalRecordForm";
import { useServices } from "../../hooks/useServices";
import ModalHeader from "../medicalRecord/ModalHeader";
import FormField from "../medicalRecord/FormField";
import VitalSignsSection from "../medicalRecord/VitalSignsSection";
import PrescriptionsSection from "../medicalRecord/PrescriptionsSection";
import ModalActions from "../medicalRecord/ModalActions";

export default function MedicalRecordModal({
  isOpen,
  onClose,
  onSubmit,
  patient,
  isLoading,
  actionType,
  existingRecord = null,
}) {
  const {
    formData,
    errors,
    handleInputChange,
    handleVitalSignChange,
    handleVitalSignBlur,
    addPrescription,
    removePrescription,
    updatePrescription,
    validateForm,
    resetForm,
    loadData,
    getCleanedData,
  } = useMedicalRecordForm();

  const { services } = useServices();
  const [selectedServiceId, setSelectedServiceId] = useState("");

  // Reset form when patient changes (new patient is called)
  useEffect(() => {
    if (patient?._id) {
      resetForm();
      setSelectedServiceId("");
    }
  }, [patient?._id, resetForm]);

  // Load existing record data when editing
  useEffect(() => {
    if (isOpen && existingRecord && actionType === "edit") {
      loadData(existingRecord);
      setSelectedServiceId("");
    } else if (isOpen && actionType === "add") {
      resetForm();
      setSelectedServiceId("");
    }
  }, [isOpen, existingRecord, actionType, loadData, resetForm]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      return;
    }
    const data = getCleanedData();
    // Add serviceId for new records
    if (actionType === "add") {
      data.serviceId = selectedServiceId;
    }
    onSubmit(data);
  }, [validateForm, getCleanedData, onSubmit, actionType, selectedServiceId]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  }, [isLoading, resetForm, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="large">
      <div className="w-full">
        <ModalHeader patient={patient} actionType={actionType} />

        <div className="max-h-[calc(80vh-220px)] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {/* Service Selection (only for new records) */}
          {actionType === "add" && (
            <section className="p-3 border border-gray-200 rounded-lg bg-purple-50">
              <label className="block mb-2 text-sm font-bold text-gray-900 font-Lexend">
                Service <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-4 py-2 text-sm transition-all duration-200 border border-gray-300 rounded-lg font-Lexend focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a service...</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </section>
          )}

          {/* Chief Complaint Section */}
          <section className="p-3 border border-gray-200 rounded-lg bg-blue-50">
            <FormField
              label="Chief Complaint"
              value={formData.chiefComplaint}
              onChange={(value) => handleInputChange("chiefComplaint", value)}
              placeholder="Describe the main reason for this visit (e.g., fever, headache, cough)..."
              error={errors.chiefComplaint}
              required
              rows={2}
            />
          </section>

          {/* Vital Signs Section */}
          <section className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
            <VitalSignsSection
              vitalSigns={formData.vitalSigns}
              onVitalSignChange={handleVitalSignChange}
              onVitalSignBlur={handleVitalSignBlur}
            />
          </section>

          {/* Clinical Assessment Section */}
          <section className="p-3 space-y-3 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div className="w-1 h-5 rounded-full bg-blue-600"></div>
              <h4 className="text-sm font-bold text-gray-900 font-Lexend">
                Clinical Assessment
              </h4>
            </div>

            <FormField
              label="Assessment/Diagnosis"
              value={formData.diagnosis}
              onChange={(value) => handleInputChange("diagnosis", value)}
              placeholder="Enter diagnosis, assessment findings, or preliminary observations..."
              rows={2}
            />

            <FormField
              label="Treatment/Clinical Notes"
              value={formData.treatmentNotes}
              onChange={(value) => handleInputChange("treatmentNotes", value)}
              placeholder="Document treatment plan, procedures performed, or clinical recommendations..."
              rows={2}
            />
          </section>

          {/* Additional Notes Section */}
          <section className="p-3 border border-gray-200 rounded-lg bg-blue-50">
            <FormField
              label="Additional Notes"
              value={formData.additionalNotes}
              onChange={(value) => handleInputChange("additionalNotes", value)}
              placeholder="Any additional observations, follow-up instructions, or relevant information..."
              rows={2}
            />
          </section>

          {/* Prescriptions Section */}
          <section className="p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
            <PrescriptionsSection
              prescriptions={formData.prescriptions}
              onAdd={addPrescription}
              onUpdate={updatePrescription}
              onRemove={removePrescription}
            />
          </section>
        </div>

        <ModalActions
          onCancel={handleClose}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          actionType={actionType}
        />
      </div>
    </Modal>
  );
}
