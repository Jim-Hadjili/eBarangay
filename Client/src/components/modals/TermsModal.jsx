import Modal from "../ui/Modal.jsx";

export default function TermsModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="flex flex-col w-full gap-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Data Privacy and Terms & Conditions
          </h2>
          <p className="text-sm text-gray-600">
            Please read carefully before proceeding
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm text-gray-700 max-h-[60vh] overflow-y-auto pr-2">
          {/* Data Privacy Section */}
          <section>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Data Privacy Notice
            </h3>
            <div className="space-y-2">
              <p>
                eBarangay Healthcare is committed to protecting your personal
                information. This Data Privacy Notice explains how we collect,
                use, and safeguard your data in accordance with the Data Privacy
                Act of 2012 (Republic Act No. 10173).
              </p>

              <h4 className="mt-3 font-semibold text-gray-800">
                Information We Collect
              </h4>
              <p>We collect and process the following personal information:</p>
              <ul className="pl-5 space-y-1 list-disc">
                <li>Name, email address, and contact information</li>
                <li>Date of birth, gender, and address</li>
                <li>Priority status (Senior Citizen, PWD, or None)</li>
                <li>Medical records and health information</li>
                <li>Queue and appointment history</li>
              </ul>

              <h4 className="mt-3 font-semibold text-gray-800">
                How We Use Your Information
              </h4>
              <p>Your personal information will be used to:</p>
              <ul className="pl-5 space-y-1 list-disc">
                <li>
                  Provide healthcare services and manage your appointments
                </li>
                <li>Maintain accurate medical records</li>
                <li>Communicate important updates and notifications</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Improve our services and user experience</li>
              </ul>

              <h4 className="mt-3 font-semibold text-gray-800">
                Data Protection and Security
              </h4>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal data against unauthorized access,
                alteration, disclosure, or destruction. Your information is
                stored securely and is only accessible to authorized personnel.
              </p>

              <h4 className="mt-3 font-semibold text-gray-800">Your Rights</h4>
              <p>Under the Data Privacy Act, you have the right to:</p>
              <ul className="pl-5 space-y-1 list-disc">
                <li>Access and obtain a copy of your personal data</li>
                <li>Request correction of inaccurate or incomplete data</li>
                <li>Object to or restrict the processing of your data</li>
                <li>
                  Request deletion of your data, subject to legal requirements
                </li>
                <li>Be informed about any data breaches that may affect you</li>
              </ul>
            </div>
          </section>

          {/* Terms and Conditions Section */}
          <section className="pt-4 border-t border-gray-200">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Terms and Conditions
            </h3>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">
                1. Acceptance of Terms
              </h4>
              <p>
                By creating an account and using eBarangay Healthcare services,
                you agree to be bound by these Terms and Conditions. If you do
                not agree, please do not use our services.
              </p>

              <h4 className="mt-3 font-semibold text-gray-800">
                2. Account Registration
              </h4>
              <p>
                You must provide accurate, current, and complete information
                during registration. You are responsible for maintaining the
                confidentiality of your account credentials and for all
                activities that occur under your account.
              </p>

              <h4 className="mt-3 font-semibold text-gray-800">
                3. Use of Services
              </h4>
              <p>
                Our services are intended for legitimate healthcare purposes
                within the barangay. You agree not to misuse the platform or
                provide false information that may affect the quality of
                healthcare services.
              </p>

              <h4 className="mt-3 font-semibold text-gray-800">
                4. Medical Information Accuracy
              </h4>
              <p>
                You are responsible for providing accurate and up-to-date
                medical information. The healthcare services provided are based
                on the information you supply, and inaccurate information may
                affect the quality of care you receive.
              </p>

              <h4 className="mt-3 font-semibold text-gray-800">
                5. Priority Status Verification
              </h4>
              <p>
                If you select a priority status (Senior Citizen or PWD), you may
                be required to provide supporting documentation for
                verification. Misrepresentation of priority status may result in
                account suspension or termination.
              </p>

              <h4 className="mt-3 font-semibold text-gray-800">
                6. Appointment and Queue Management
              </h4>
              <p>
                While we strive to honor all appointments and queue positions,
                scheduling is subject to healthcare provider availability and
                emergency situations. The barangay health center reserves the
                right to reschedule appointments when necessary.
              </p>

              <h4 className="mt-3 font-semibold text-gray-800">
                7. Limitation of Liability
              </h4>
              <p>
                eBarangay Healthcare is a management platform and does not
                replace professional medical advice, diagnosis, or treatment.
                Always seek the advice of qualified health providers with any
                questions regarding medical conditions.
              </p>

              <h4 className="mt-3 font-semibold text-gray-800">
                8. Changes to Terms
              </h4>
              <p>
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting. Your continued use
                of the service after changes constitutes acceptance of the new
                terms.
              </p>

              <h4 className="mt-3 font-semibold text-gray-800">
                9. Contact Information
              </h4>
              <p>
                For questions about these terms or our privacy practices, please
                contact your local barangay health center or the system
                administrator.
              </p>
            </div>
          </section>
        </div>

        {/* Close Button */}
        <div className="flex justify-end w-full pt-2 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 font-medium text-white transition-colors bg-green-500 rounded-lg cursor-pointer hover:bg-green-600"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
