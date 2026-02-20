import { useState } from "react";
import Modal from "../ui/Modal";
import SelectStep from "./generateQueue/SelectStep";
import UnregisteredPatientForm from "./generateQueue/UnregisteredPatientForm";
import ExistingPatientForm from "./generateQueue/ExistingPatientForm";

export default function GenerateQueueModal({ isOpen, onClose }) {
  const [step, setStep] = useState("select");

  const handleClose = () => {
    setStep("select");
    onClose();
  };

  const handleBack = () => setStep("select");

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="default">
      {step === "select" && (
        <SelectStep
          onExistingPatient={() => setStep("existing")}
          onUnregisteredPatient={() => setStep("unregistered")}
        />
      )}
      {step === "existing" && (
        <ExistingPatientForm onBack={handleBack} onClose={handleClose} />
      )}
      {step === "unregistered" && (
        <UnregisteredPatientForm onBack={handleBack} onClose={handleClose} />
      )}
    </Modal>
  );
}
