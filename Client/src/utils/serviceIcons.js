import {
  faStethoscope,
  faBaby,
  faSyringe,
  faHeartPulse,
  faWeightScale,
  faPeopleGroup,
  faAppleWhole,
  faChildReaching,
  faFileText,
  faBandage,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

// Map service identifiers to FontAwesome icons
export const serviceIconMap = {
  general_checkup: faStethoscope,
  maternity_checkup: faBaby,
  vaccination: faSyringe,
  blood_pressure: faHeartPulse,
  weight_height: faWeightScale,
  family_planning: faPeopleGroup,
  nutrition_counseling: faAppleWhole,
  child_checkup: faChildReaching,
  medical_certificate: faFileText,
  minor_wound_treatment: faBandage,
  follow_up_consultation: faClockRotateLeft,
};

// Get icon for a service by identifier or name
export const getServiceIcon = (service) => {
  if (!service) return faStethoscope; // default icon

  // Try to match by identifier first
  if (service.identifier && serviceIconMap[service.identifier]) {
    return serviceIconMap[service.identifier];
  }

  // Fallback: try to match by name (convert to identifier format)
  const nameAsIdentifier = service.name
    ?.toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[&-]/g, "");

  return serviceIconMap[nameAsIdentifier] || faStethoscope;
};
