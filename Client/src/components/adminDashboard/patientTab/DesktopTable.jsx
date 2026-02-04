import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { User } from "lucide-react";
import Pagination from "../../ui/Pagination";
import { SOCKET_URL } from "../../../hooks/usePatients";

export default function DesktopTable({
  patients,
  onDelete,
  onView,
  onProfileClick,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = patients.slice(startIndex, endIndex);

  return (
    <>
      <div className="hidden space-y-4 md:block">
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Address
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Registered Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-right text-gray-700 uppercase font-Lexend">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentPatients.map((patient, idx) => (
                  <tr
                    key={patient.id}
                    className="transition-all duration-200 group hover:bg-linear-to-r hover:from-gray-50 hover:to-transparent"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onProfileClick(patient)}
                          className="flex items-center justify-center w-10 h-10 overflow-hidden transition-all duration-200 bg-blue-500 rounded-full cursor-pointer font-Lexend hover:ring-4 hover:ring-blue-200"
                        >
                          {patient.profileImage ? (
                            <img
                              src={`${SOCKET_URL}${patient.profileImage}`}
                              alt={patient.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <User size={24} className="text-white" />
                          )}
                        </button>
                        <div>
                          <p className="font-semibold text-gray-900 font-Lexend">
                            {patient.name}
                          </p>
                          <p className="text-xs text-gray-500 font-Lexend">
                            {patient.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-Lexend">
                      {patient.phone}
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-Lexend">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-Lexend">
                      <span className="line-clamp-2">{patient.address}</span>
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-Lexend">
                      {patient.registeredDate}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onView(patient)}
                          className="group/btn p-2.5 text-green-600 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 hover:border-green-200 transition-all duration-200 hover:shadow-sm cursor-pointer"
                          aria-label="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(patient)}
                          className="group/btn p-2.5 text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:border-red-200 transition-all duration-200 hover:shadow-sm cursor-pointer"
                          aria-label="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={patients.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
