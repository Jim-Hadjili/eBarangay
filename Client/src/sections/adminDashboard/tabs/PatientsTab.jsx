import { useState } from "react";
import { Search } from "lucide-react";
import Header from "../../../components/adminDashboard/patientTab/Header";
import DesktopTable from "../../../components/adminDashboard/patientTab/DesktopTable";
import MobileTable from "../../../components/adminDashboard/patientTab/MobileTable";
import EmptyState from "../../../components/adminDashboard/patientTab/EmptyState";
import DeleteConfirmModal from "../../../components/ui/DeleteConfirmModal";
import Toast from "../../../components/ui/Toast";
import { usePatients } from "../../../hooks/usePatients";
import { useDeletePatient } from "../../../hooks/useDeletePatient";

export default function PatientsTab() {
  const { patients, loading, error, refetch } = usePatients();
  const { deletePatient, loading: deleteLoading } = useDeletePatient();

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    patient: null,
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleDeleteClick = (patient) => {
    setDeleteModal({
      isOpen: true,
      patient,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePatient(deleteModal.patient.id);
      setDeleteModal({ isOpen: false, patient: null });
      setToast({
        show: true,
        message: `${deleteModal.patient.name} has been deleted successfully!`,
        type: "success",
      });
      refetch();
    } catch (err) {
      setToast({
        show: true,
        message: err.message || "Failed to delete patient",
        type: "error",
      });
    }
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower) ||
      (patient.phone && patient.phone.toLowerCase().includes(searchLower)) ||
      (patient.gender && patient.gender.toLowerCase().includes(searchLower)) ||
      (patient.address && patient.address.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center w-full h-screen">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-gray-600 font-Lexend">Loading Patient List...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
          <Header />
          <div className="flex items-center justify-center p-12 mt-10 text-center bg-white border border-red-200 shadow-sm rounded-xl">
            <p className="text-red-600 font-Lexend">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
        <Header />

        {/* Search Bar */}
        {patients.length > 0 && (
          <div className="flex items-center justify-end mb-6">
            <div className="w-full sm:w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg font-Lexend focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="mt-2 text-sm text-right text-gray-600 font-Lexend">
                  Found {filteredPatients.length} result
                  {filteredPatients.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        )}

        {filteredPatients.length > 0 ? (
          <>
            <DesktopTable
              patients={filteredPatients}
              onDelete={handleDeleteClick}
            />
            <MobileTable
              patients={filteredPatients}
              onDelete={handleDeleteClick}
            />
          </>
        ) : searchQuery ? (
          <div className="p-12 mt-10 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900 font-Lexend">
              No Results Found
            </h3>
            <p className="mb-6 text-sm text-gray-600 font-Lexend">
              No patients match your search "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-green-600 font-semibold bg-green-100 border-2 border-green-400 rounded-lg hover:bg-green-200 transition-all duration-200 font-Lexend"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, patient: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Patient"
        message="Are you sure you want to delete this patient? This will permanently remove all their data from the system."
        itemName={deleteModal.patient?.name}
        loading={deleteLoading}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
