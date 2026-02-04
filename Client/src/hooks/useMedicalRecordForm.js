import { useState, useCallback, useMemo } from "react";

const initialFormData = {
  chiefComplaint: "",
  vitalSigns: {
    bloodPressure: "",
    temperature: "",
    pulseRate: "",
    respiratoryRate: "",
    weight: "",
    height: "",
  },
  diagnosis: "",
  treatmentNotes: "",
  prescriptions: [],
  additionalNotes: "",
};

export const useMedicalRecordForm = (initialData = null) => {
  const [formData, setFormData] = useState(initialData || initialFormData);
  const [errors, setErrors] = useState({});

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (prev[field]) {
        const { [field]: _, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  }, []);

  const handleVitalSignChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      vitalSigns: { ...prev.vitalSigns, [field]: value },
    }));
  }, []);

  const handleVitalSignBlur = useCallback((field, value, unit) => {
    if (!value.trim()) return;

    let numericValue = value.trim();

    const unitsToRemove = {
      temperature: ["°C", "°c", "C", "c"],
      pulseRate: ["bpm", "BPM", "/min"],
      respiratoryRate: ["/min", "bpm", "BPM"],
      weight: ["kg", "KG", "Kg"],
      height: ["cm", "CM", "Cm"],
    };

    if (unitsToRemove[field]) {
      unitsToRemove[field].forEach((u) => {
        numericValue = numericValue
          .replace(new RegExp(u + "$", "i"), "")
          .trim();
      });
    }

    if (numericValue) {
      const formattedValue = `${numericValue} ${unit}`;
      setFormData((prev) => ({
        ...prev,
        vitalSigns: { ...prev.vitalSigns, [field]: formattedValue },
      }));
    }
  }, []);

  const addPrescription = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: [...prev.prescriptions, ""],
    }));
  }, []);

  const removePrescription = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index),
    }));
  }, []);

  const updatePrescription = useCallback((index, value) => {
    setFormData((prev) => ({
      ...prev,
      prescriptions: prev.prescriptions.map((p, i) =>
        i === index ? value : p,
      ),
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.chiefComplaint.trim()) {
      newErrors.chiefComplaint = "Chief complaint is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.chiefComplaint]);

  const resetForm = useCallback(() => {
    setFormData(initialData || initialFormData);
    setErrors({});
  }, [initialData]);

  const loadData = useCallback((data) => {
    setFormData({
      chiefComplaint: data.chiefComplaint || "",
      vitalSigns: data.vitalSigns || initialFormData.vitalSigns,
      diagnosis: data.diagnosis || "",
      treatmentNotes: data.treatmentNotes || "",
      prescriptions: data.prescriptions || [],
      additionalNotes: data.additionalNotes || "",
    });
    setErrors({});
  }, []);

  const getCleanedData = useCallback(
    () => ({
      ...formData,
      prescriptions: formData.prescriptions.filter((p) => p.trim()),
    }),
    [formData],
  );

  return {
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
  };
};
