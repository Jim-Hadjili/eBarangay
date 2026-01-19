// Client/src/sections/adminDashboard/tabs/PatientsTab.jsx
import { Search, Filter, Eye, Edit, Trash2, User } from "lucide-react";

export default function PatientsTab() {
  const patients = [
    {
      id: 1,
      name: "Juan Dela Cruz",
      email: "juan.delacruz@email.com",
      phone: "0912-345-6789",
      registeredDate: "2025-01-15",
      lastVisit: "2025-01-17",
      status: "active",
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "0923-456-7890",
      registeredDate: "2025-01-10",
      lastVisit: "2025-01-18",
      status: "active",
    },
    {
      id: 3,
      name: "Pedro Ramos",
      email: "pedro.ramos@email.com",
      phone: "0934-567-8901",
      registeredDate: "2024-12-20",
      lastVisit: "2025-01-05",
      status: "inactive",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl font-Lexend">
              Patients Management
            </h2>
            <p className="text-sm text-gray-600 sm:text-base font-Lexend">
              View and manage patient records
            </p>
          </div>
          <div className="flex flex-col w-full gap-2 sm:flex-row sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search
                className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                size={20}
              />
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg sm:w-64 focus:ring-2 focus:ring-green-500 focus:border-transparent font-Lexend"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-gray-700 transition-all duration-200 bg-gray-100 rounded-lg hover:bg-gray-200 font-Lexend">
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden bg-white border border-gray-200 shadow-sm md:block rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Registered Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Last Visit
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-right text-gray-700 uppercase font-Lexend">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map((patient, idx) => (
                  <tr
                    key={patient.id}
                    className="transition-all duration-200 group hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-blue-500 rounded-full font-Lexend">
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
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
                      {patient.registeredDate}
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-Lexend">
                      {patient.lastVisit}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold font-Lexend ${
                          patient.status === "active"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="group/btn p-2.5 text-green-600 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 hover:border-green-200 transition-all duration-200 hover:shadow-sm"
                          aria-label="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="group/btn p-2.5 text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 hover:border-blue-200 transition-all duration-200 hover:shadow-sm"
                          aria-label="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="group/btn p-2.5 text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:border-red-200 transition-all duration-200 hover:shadow-sm"
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

        {/* Mobile/Tablet Card View */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {patients.map((patient, idx) => (
            <div
              key={patient.id}
              className="overflow-hidden transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
            >
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 text-lg font-bold text-white bg-blue-500 rounded-full font-Lexend">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 truncate font-Lexend">
                    {patient.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate font-Lexend">
                    {patient.email}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold font-Lexend ${
                    patient.status === "active"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {patient.status}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                  <User size={16} />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                  <span className="font-semibold">Registered:</span>
                  <span>{patient.registeredDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                  <span className="font-semibold">Last Visit:</span>
                  <span>{patient.lastVisit}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-green-700 font-semibold bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-200 font-Lexend">
                    <Eye size={18} />
                    <span>View</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-blue-700 font-semibold bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 font-Lexend">
                    <Edit size={18} />
                    <span>Edit</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-red-700 font-semibold bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 font-Lexend">
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {patients.length === 0 && (
          <div className="p-12 mt-10 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900 font-Lexend">
              No Patients Found
            </h3>
            <p className="mb-6 text-sm text-gray-600 font-Lexend">
              Patient records will appear here once available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
