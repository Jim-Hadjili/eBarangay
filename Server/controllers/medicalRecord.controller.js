const MedicalRecord = require("../models/medicalRecordSchema");
const Queue = require("../models/queueSchema");
const User = require("../models/userSchema");
const Service = require("../models/serviceSchema");
const ActivityLogger = require("../utils/activityLogger");

exports.createMedicalRecord = async (req, res) => {
  try {
    const {
      queueId,
      patientId,
      serviceId,
      chiefComplaint,
      vitalSigns,
      diagnosis,
      treatmentNotes,
      prescriptions,
      additionalNotes,
    } = req.body;

    const recordedBy = req.user.id;

    let patient, service, queueRef;

    // If queueId is provided, get data from queue
    if (queueId) {
      const queue = await Queue.findById(queueId)
        .populate("patient", "firstName lastName")
        .populate("service", "name");

      if (!queue) {
        return res.status(404).json({ message: "Queue not found" });
      }

      patient = queue.patient;
      service = queue.service;
      queueRef = queueId;
    } else {
      // Direct record creation (from patient history)
      if (!patientId || !serviceId) {
        return res.status(400).json({
          message: "Patient ID and Service ID are required",
        });
      }

      patient = await User.findById(patientId);
      service = await Service.findById(serviceId);

      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      queueRef = null;
    }

    // Create medical record
    const medicalRecord = await MedicalRecord.create({
      patient: patient._id,
      service: service._id,
      queue: queueRef,
      recordedBy,
      chiefComplaint,
      vitalSigns: vitalSigns || {},
      diagnosis: diagnosis || "",
      treatmentNotes: treatmentNotes || "",
      prescriptions: prescriptions || [],
      additionalNotes: additionalNotes || "",
      visitDate: new Date(),
    });

    // Log activity
    await ActivityLogger.log({
      activityType: "medical_record_created",
      description: `Medical record created for ${patient.firstName} ${patient.lastName} at ${service.name}`,
      performedBy: recordedBy,
      targetUser: patient._id,
      service: service._id,
      metadata: { medicalRecordId: medicalRecord._id, queueId: queueRef },
    });

    // Emit activity update
    const io = req.app.get("io");
    if (io) {
      io.to("dashboard").emit("activityUpdate");
    }

    res.status(201).json({
      message: "Medical record created successfully",
      medicalRecord: {
        _id: medicalRecord._id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        serviceName: service.name,
        visitDate: medicalRecord.visitDate,
      },
    });
  } catch (err) {
    console.error("Error creating medical record:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getPatientMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.params;

    const records = await MedicalRecord.find({ patient: patientId })
      .populate("service", "name identifier")
      .populate("recordedBy", "firstName lastName")
      .populate("updateHistory.updatedBy", "firstName lastName")
      .sort({ visitDate: -1 });

    res.json({ records });
  } catch (err) {
    console.error("Error fetching medical records:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMedicalRecordById = async (req, res) => {
  try {
    const { recordId } = req.params;

    const record = await MedicalRecord.findById(recordId)
      .populate("patient", "firstName lastName email phone dateOfBirth gender")
      .populate("service", "name identifier")
      .populate("recordedBy", "firstName lastName")
      .populate("updateHistory.updatedBy", "firstName lastName");

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.json({ record });
  } catch (err) {
    console.error("Error fetching medical record:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const {
      chiefComplaint,
      vitalSigns,
      diagnosis,
      treatmentNotes,
      prescriptions,
      additionalNotes,
    } = req.body;

    const updatedBy = req.user.id;

    const record = await MedicalRecord.findById(recordId)
      .populate("patient", "firstName lastName")
      .populate("service", "name");

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    // Update fields
    if (chiefComplaint !== undefined) record.chiefComplaint = chiefComplaint;
    if (vitalSigns !== undefined) record.vitalSigns = vitalSigns;
    if (diagnosis !== undefined) record.diagnosis = diagnosis;
    if (treatmentNotes !== undefined) record.treatmentNotes = treatmentNotes;
    if (prescriptions !== undefined) record.prescriptions = prescriptions;
    if (additionalNotes !== undefined) record.additionalNotes = additionalNotes;

    // Add update history entry
    record.updateHistory.push({
      updatedBy,
      updatedAt: new Date(),
    });

    await record.save();

    // Log activity
    await ActivityLogger.log({
      activityType: "medical_record_updated",
      description: `Medical record updated for ${record.patient.firstName} ${record.patient.lastName} at ${record.service.name}`,
      performedBy: updatedBy,
      targetUser: record.patient._id,
      service: record.service._id,
      metadata: { medicalRecordId: record._id },
    });

    // Emit activity update
    const io = req.app.get("io");
    if (io) {
      io.to("dashboard").emit("activityUpdate");
    }

    res.json({
      message: "Medical record updated successfully",
      medicalRecord: {
        _id: record._id,
        patientName: `${record.patient.firstName} ${record.patient.lastName}`,
        serviceName: record.service.name,
        visitDate: record.visitDate,
      },
    });
  } catch (err) {
    console.error("Error updating medical record:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
