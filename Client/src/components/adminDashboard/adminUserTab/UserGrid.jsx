import { useState } from "react";
import {
  Mail,
  Phone,
  Trash2,
  Calendar,
  MapPin,
  User,
  User2,
  UserRound,
} from "lucide-react";
import { SOCKET_URL } from "../../../hooks/usePatients";
import DeleteConfirmModal from "../../ui/DeleteConfirmModal";
import Pagination from "../../ui/Pagination";
import { useDeleteAdmin } from "../../../hooks/useDeleteAdmin";

export default function UserGrid({
  adminUsers,
  currentUser,
  onDeleteSuccess,
  onProfileClick,
}) {
  // Check if current user is Super Admin (based on userType from JWT)
  const isSuperAdmin = currentUser?.userType === "Super Admin";
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    admin: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { deleteAdmin, loading } = useDeleteAdmin();

  const handleDeleteClick = (admin) => {
    setDeleteModal({ isOpen: true, admin });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAdmin(deleteModal.admin.id);
      setDeleteModal({ isOpen: false, admin: null });
      if (onDeleteSuccess) {
        onDeleteSuccess(deleteModal.admin.name);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Check if admin is the current user
  const isCurrentUser = (admin) => {
    return currentUser?.email === admin.email;
  };

  // Calculate pagination
  const totalPages = Math.ceil(adminUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAdmins = adminUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of the grid
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {currentAdmins.map((admin, idx) => {
          const isYou = isCurrentUser(admin);

          return (
            <div
              key={admin.id}
              className={`relative flex flex-col overflow-hidden transition-shadow duration-200 bg-white shadow-sm rounded-xl hover:shadow-lg ${
                isYou
                  ? "border-2 border-green-500 shadow-lg ring-2 ring-green-200"
                  : "border-2 border-gray-200"
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* You Badge */}
              {isYou && (
                <span className="absolute z-10 px-3 py-1 text-xs text-white bg-green-500 border border-green-600 rounded-full top-4 right-4 font-Lexend">
                  You
                </span>
              )}

              {/* Card Content */}
              <div className="flex flex-col flex-1 p-6">
                {/* Avatar and Name */}
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => onProfileClick(admin)}
                    className={`flex items-center justify-center rounded-full shadow-md w-16 h-16 overflow-hidden transition-transform duration-200 cursor-pointer hover:scale-105 ${
                      isYou ? "bg-green-500" : "bg-green-500"
                    }`}
                  >
                    {admin.profileImage ? (
                      <img
                        src={`${SOCKET_URL}${admin.profileImage}`}
                        alt={admin.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User
                        size={36}
                        className="text-white"
                        strokeWidth={2.5}
                      />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate font-sans-serif sm:text-xl font-Lexend">
                      {admin.name}
                    </h3>
                    <span className="inline-block px-2 py-1 mt-1 text-xs text-green-700 bg-green-100 border border-green-200 rounded-md font-Lexend">
                      {admin.role} / Staff
                    </span>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="mb-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                    <Mail size={16} className="text-green-600" />
                    <span className="truncate">{admin.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                    <Calendar size={16} className="text-green-600" />
                    <span>
                      Joined:{" "}
                      {admin.createdAt
                        ? new Date(admin.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {isSuperAdmin && !isYou && (
                  <div className="flex gap-2 pt-4 mt-auto border-t border-gray-100">
                    <button
                      onClick={() => handleDeleteClick(admin)}
                      className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 font-Lexend"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                      <span>Remove Admin</span>
                    </button>
                  </div>
                )}

                {/* Show message if user cannot delete themselves */}
                {isYou && (
                  <div className="pt-4 mt-auto text-center border-t border-gray-100">
                    <p className="text-xs font-medium text-green-600 font-Lexend">
                      ✓ Your Admin Account
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {adminUsers.length > itemsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={adminUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, admin: null })}
        onConfirm={handleDeleteConfirm}
        title="Remove Admin User"
        message="Are you sure you want to remove this admin user from the system? This will revoke their access immediately and cannot be undone."
        itemName={deleteModal.admin?.name}
        loading={loading}
      />
    </>
  );
}
