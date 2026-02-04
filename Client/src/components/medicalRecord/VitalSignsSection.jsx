import { memo, useCallback } from "react";
import { Activity } from "lucide-react";
import VitalSignInput from "./VitalSignInput";

function VitalSignsSection({ vitalSigns, onVitalSignChange, onVitalSignBlur }) {
  const handleBlurTemperature = useCallback(
    (e) => {
      onVitalSignBlur("temperature", e.target.value, "°C");
    },
    [onVitalSignBlur],
  );

  const handleBlurPulseRate = useCallback(
    (e) => {
      onVitalSignBlur("pulseRate", e.target.value, "bpm");
    },
    [onVitalSignBlur],
  );

  const handleBlurRespiratoryRate = useCallback(
    (e) => {
      onVitalSignBlur("respiratoryRate", e.target.value, "/min");
    },
    [onVitalSignBlur],
  );

  const handleBlurWeight = useCallback(
    (e) => {
      onVitalSignBlur("weight", e.target.value, "kg");
    },
    [onVitalSignBlur],
  );

  const handleBlurHeight = useCallback(
    (e) => {
      onVitalSignBlur("height", e.target.value, "cm");
    },
    [onVitalSignBlur],
  );

  const handleChangeBloodPressure = useCallback(
    (value) => {
      onVitalSignChange("bloodPressure", value);
    },
    [onVitalSignChange],
  );

  const handleChangeTemperature = useCallback(
    (value) => {
      onVitalSignChange("temperature", value);
    },
    [onVitalSignChange],
  );

  const handleChangePulseRate = useCallback(
    (value) => {
      onVitalSignChange("pulseRate", value);
    },
    [onVitalSignChange],
  );

  const handleChangeRespiratoryRate = useCallback(
    (value) => {
      onVitalSignChange("respiratoryRate", value);
    },
    [onVitalSignChange],
  );

  const handleChangeWeight = useCallback(
    (value) => {
      onVitalSignChange("weight", value);
    },
    [onVitalSignChange],
  );

  const handleChangeHeight = useCallback(
    (value) => {
      onVitalSignChange("height", value);
    },
    [onVitalSignChange],
  );
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100">
          <Activity className="w-4 h-4 text-blue-600" />
        </div>
        <h4 className="text-sm font-bold text-gray-900 font-Lexend">
          Vital Signs
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <VitalSignInput
          label="Blood Pressure"
          value={vitalSigns.bloodPressure}
          onChange={handleChangeBloodPressure}
          placeholder="e.g., 120/80"
        />
        <VitalSignInput
          label="Temperature"
          value={vitalSigns.temperature}
          onChange={handleChangeTemperature}
          onBlur={handleBlurTemperature}
          placeholder="e.g., 37"
        />
        <VitalSignInput
          label="Pulse Rate"
          value={vitalSigns.pulseRate}
          onChange={handleChangePulseRate}
          onBlur={handleBlurPulseRate}
          placeholder="e.g., 80"
        />
        <VitalSignInput
          label="Respiratory Rate"
          value={vitalSigns.respiratoryRate}
          onChange={handleChangeRespiratoryRate}
          onBlur={handleBlurRespiratoryRate}
          placeholder="e.g., 16"
        />
        <VitalSignInput
          label="Weight"
          value={vitalSigns.weight}
          onChange={handleChangeWeight}
          onBlur={handleBlurWeight}
          placeholder="e.g., 70"
        />
        <VitalSignInput
          label="Height"
          value={vitalSigns.height}
          onChange={handleChangeHeight}
          onBlur={handleBlurHeight}
          placeholder="e.g., 170"
        />
      </div>
    </div>
  );
}

export default memo(VitalSignsSection);
