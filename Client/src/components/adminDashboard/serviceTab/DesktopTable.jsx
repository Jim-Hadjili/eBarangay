import { Users, ToggleRight, ToggleLeft, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import Pagination from "../../ui/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getServiceIcon } from "../../../utils/serviceIcons";

export default function DesktopTable({ services, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Calculate pagination
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = services.slice(startIndex, endIndex);

  return (
    <>
      <div className="hidden space-y-4 md:block">
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-bold tracking-wider text-gray-700 uppercase font-Lexend">
                      Service Name
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-bold tracking-wider text-gray-700 uppercase font-Lexend">
                      Status
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-bold tracking-wider text-gray-700 uppercase font-Lexend">
                      Current Queue
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-xs font-bold tracking-wider text-gray-700 uppercase font-Lexend">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentServices.map((service, index) => (
                  <tr
                    key={service.id}
                    className="transition-all duration-200 group hover:bg-linear-to-r hover:from-gray-50 hover:to-transparent"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 text-green-600 transition-colors duration-200 rounded-lg bg-linear-to-br from-green-50 to-green-100 group-hover:from-green-100 group-hover:to-green-200">
                          <FontAwesomeIcon
                            icon={getServiceIcon(service)}
                            size="lg"
                          />
                        </div>
                        <span className="font-semibold text-gray-900 font-Lexend">
                          {service.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold font-Lexend ${
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
                    </td>
                    <td className="px-6 py-5">
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
                        <span className="font-semibold text-gray-900 font-Lexend">
                          {service.queue}
                        </span>
                        <span className="text-sm text-gray-600 font-Lexend">
                          waiting
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit && onEdit(service)}
                          className="group/btn p-2.5 cursor-pointer text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 hover:border-blue-200 transition-all duration-200 hover:shadow-sm"
                          aria-label="Edit service"
                        >
                          <Edit
                            size={18}
                            strokeWidth={2}
                            className="transition-transform duration-200 group-hover/btn:scale-110"
                          />
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(service)}
                          className="group/btn p-2.5 cursor-pointer text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:border-red-200 transition-all duration-200 hover:shadow-sm"
                          aria-label="Delete service"
                        >
                          <Trash2
                            size={18}
                            strokeWidth={2}
                            className="transition-transform duration-200 group-hover/btn:scale-110"
                          />
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
          totalItems={services.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}
