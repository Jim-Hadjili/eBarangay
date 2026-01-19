import { Eye, Trash2, MapPin, User } from "lucide-react";
import { useState } from "react";
import Pagination from "../../ui/Pagination";

export default function MobileTable({ patients, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = patients.slice(startIndex, endIndex);

  return (
    <>
      <div className="space-y-4 md:hidden">
        <div className="grid grid-cols-1 gap-4">
          {currentPatients.map((patient, idx) => (
            <div
              key={patient.id}
              className="overflow-hidden transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
            >
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full font-Lexend">
                  <User size={28} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 truncate font-Lexend">
                    {patient.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate font-Lexend">
                    {patient.email}
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                  <User size={16} />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                  <span className="font-semibold">Gender:</span>
                  <span>{patient.gender}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600 font-Lexend">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{patient.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                  <span className="font-semibold">Registered:</span>
                  <span>{patient.registeredDate}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 text-green-700 font-semibold bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-200 font-Lexend">
                    <Eye size={18} />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => onDelete(patient)}
                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 text-red-700 font-semibold bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 font-Lexend"
                  >
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
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
