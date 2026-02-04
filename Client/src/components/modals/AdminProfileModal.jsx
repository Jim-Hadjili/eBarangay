import Modal from "../ui/Modal";
import { User, Mail, Phone, Calendar, MapPin, Users } from "lucide-react";
import { SOCKET_URL } from "../../hooks/usePatients";

export default function AdminProfileModal({ isOpen, onClose, admin }) {
  if (!admin) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="w-full">
        <h2 className="mb-6 text-xl font-bold text-gray-900 font-Lexend">
          Admin Profile
        </h2>

        {/* Profile Section */}
        <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-200">
          <div className="overflow-hidden border-2 border-green-500 rounded-full w-25 h-25 bg-green-500 shrink-0">
            {admin.profileImage ? (
              <img
                src={`${SOCKET_URL}${admin.profileImage}`}
                alt={admin.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <User size={40} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate font-Lexend">
              {admin.name}
            </h3>
            <span className="inline-block px-2 py-1 mt-1 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 rounded-md font-Lexend">
              {admin.role} / Staff
            </span>
          </div>
        </div>

        {/* Admin Information - Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
          {/* Left Column - Contact Information */}
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase font-Lexend">
              Contact Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
                  <Mail size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 font-Lexend">
                    Email Address
                  </p>
                  <p className="text-sm text-gray-900 wrap-break-word font-Lexend">
                    {admin.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg shrink-0">
                  <Phone size={16} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 font-Lexend">
                    Phone Number
                  </p>
                  <p className="text-sm text-gray-900 font-Lexend">
                    {admin.phone}
                  </p>
                </div>
              </div>
              {admin.address && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg shrink-0">
                    <MapPin size={16} className="text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 font-Lexend">
                      Address
                    </p>
                    <p className="text-sm text-gray-900 font-Lexend">
                      {admin.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Personal Information */}
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wide text-gray-400 uppercase font-Lexend">
              Personal Information
            </h4>
            <div className="space-y-3">
              {admin.gender && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg shrink-0">
                    <Users size={16} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 font-Lexend">
                      Gender
                    </p>
                    <p className="text-sm text-gray-900 font-Lexend">
                      {admin.gender}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-pink-100 rounded-lg shrink-0">
                  <Calendar size={16} className="text-pink-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 font-Lexend">
                    Date of Birth
                  </p>
                  <p className="text-sm text-gray-900 font-Lexend">
                    {admin.dateOfBirth || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg shrink-0">
                  <Calendar size={16} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 font-Lexend">
                    Joined Date
                  </p>
                  <p className="text-sm text-gray-900 font-Lexend">
                    {admin.createdAt
                      ? new Date(admin.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end w-full pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 cursor-pointer py-2 text-sm font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600 font-Lexend"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
