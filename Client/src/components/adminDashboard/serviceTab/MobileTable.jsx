import { Users, ToggleRight, ToggleLeft, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import Pagination from "../../ui/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServiceIcon } from "../../../utils/serviceIcons";

export default function MobileTable({ services, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = services.slice(startIndex, endIndex);

  return (
    <>
      <div className="space-y-4 md:hidden">
        {/* Service Cards */}
        <div className="grid grid-cols-1 gap-4">
          {currentServices.map((service, index) => (
            <div
              key={service.id}
              className="overflow-hidden transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                <div className="flex items-center flex-1 min-w-0 gap-3">
                  <div className="flex items-center justify-center w-12 h-12 text-green-600 rounded-lg bg-linear-to-br from-green-50 to-green-100 shrink-0">
                    <FontAwesomeIcon icon={getServiceIcon(service)} size="lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 truncate sm:text-lg font-Lexend">
                      {service.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-4">
                {/* Status and Queue Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase font-Lexend">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold font-Lexend ${
                        service.status === "active"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {service.status === "active" ? (
                        <ToggleRight size={16} strokeWidth={2.5} />
                      ) : (
                        <ToggleLeft size={16} strokeWidth={2.5} />
                      )}
                      <span className="capitalize">{service.status}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase font-Lexend">
                      Queue
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                          service.queue > 0
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Users size={14} strokeWidth={2.5} />
                      </div>
                      <div>
                        <span className="text-lg font-bold text-gray-900 font-Lexend">
                          {service.queue}
                        </span>
                        <span className="ml-1 text-sm text-gray-600 font-Lexend">
                          waiting
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onEdit && onEdit(service)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-blue-700 font-semibold bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-Lexend"
                  >
                    <Edit size={18} strokeWidth={2} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(service)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-red-700 font-semibold bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 font-Lexend"
                  >
                    <Trash2 size={18} strokeWidth={2} />
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
          totalItems={services.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
