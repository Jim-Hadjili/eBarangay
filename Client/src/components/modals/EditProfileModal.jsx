import Modal from "../ui/Modal";
import Toast from "../ui/Toast";
import ProfileImageUpload from "../editProfile/ProfileImageUpload";
import BasicDetailsSection from "../editProfile/BasicDetailsSection";
import ContactDetailsSection from "../editProfile/ContactDetailsSection";
import PasswordChangeSection from "../editProfile/PasswordChangeSection";
import FormActions from "../editProfile/FormActions";
import { useEditProfileForm } from "../../hooks/useEditProfileForm";
import { usePasswordValidation } from "../../hooks/usePasswordValidation";
import { useProfileImage } from "../../hooks/useProfileImage";
import { useToast } from "../../hooks/useToast";

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  // Custom hooks for managing form logic
  const {
    formData,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    buildFormData,
  } = useEditProfileForm(user);

  const {
    passwordData,
    passwordError,
    isPasswordSectionOpen,
    handlePasswordChange,
    togglePasswordSection,
    resetPasswordFields,
    validatePassword,
    hasPasswordData,
    setPasswordError,
  } = usePasswordValidation();

  const { profileImage, imagePreview, handleImageChange } =
    useProfileImage(user);

  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPasswordError("");

    // Validate password fields
    if (!validatePassword()) {
      setIsSubmitting(false);
      return;
    }

    // Build form data
    const formDataToSend = buildFormData(
      profileImage,
      passwordData,
      hasPasswordData(),
    );

    try {
      await onSave(formDataToSend);
      resetPasswordFields();
      showToast(
        "Profile Updated",
        "Your profile has been updated successfully!",
        "success",
      );
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";

      if (error.response?.data?.message?.includes("password")) {
        setPasswordError(errorMessage);
      }

      showToast("Update Failed", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast
        isVisible={toast.show}
        onClose={hideToast}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={5000}
        position="top-right"
      />
      <Modal isOpen={isOpen} onClose={onClose} size="large">
        <div className="w-full">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit} className="w-full flex flex-col">
            {/* Scrollable content wrapper */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] border-2 border-gray-200 rounded-2xl p-3 scrollbar-hide">
              {/* Profile Image Section */}
              <ProfileImageUpload
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
              />

              {/* Two Column Layout: Basic Details (Left) and Contact Details (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                {/* Left Column - Basic Details */}
                <BasicDetailsSection
                  formData={formData}
                  onChange={handleInputChange}
                />

                {/* Right Column - Contact Details */}
                <ContactDetailsSection
                  formData={formData}
                  onChange={handleInputChange}
                />
              </div>

              {/* Collapsible Change Password Section */}
              <PasswordChangeSection
                isOpen={isPasswordSectionOpen}
                onToggle={togglePasswordSection}
                passwordData={passwordData}
                onChange={handlePasswordChange}
                error={passwordError}
              />
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <FormActions onCancel={onClose} isSubmitting={isSubmitting} />
          </form>
        </div>
      </Modal>
    </>
  );
}
