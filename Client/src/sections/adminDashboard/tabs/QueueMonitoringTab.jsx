// Client/src/sections/adminDashboard/tabs/QueueMonitoringTab.jsx
import { Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function QueueMonitoringTab() {
  const queueItems = [
    {
      id: 1,
      queueNumber: "A001",
      patientName: "Juan Dela Cruz",
      service: "Medical Consultation",
      status: "serving",
      waitTime: "5 mins",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      queueNumber: "A002",
      patientName: "Maria Garcia",
      service: "Laboratory Services",
      status: "waiting",
      waitTime: "15 mins",
      timestamp: "10:35 AM",
    },
    {
      id: 3,
      queueNumber: "A003",
      patientName: "Pedro Ramos",
      service: "Dental Services",
      status: "waiting",
      waitTime: "20 mins",
      timestamp: "10:40 AM",
    },
    {
      id: 4,
      queueNumber: "A004",
      patientName: "Ana Cruz",
      service: "Medical Consultation",
      status: "completed",
      waitTime: "25 mins",
      timestamp: "10:00 AM",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "serving":
        return <AlertCircle className="text-orange-500" size={20} />;
      case "waiting":
        return <Clock className="text-blue-500" size={20} />;
      case "completed":
        return <CheckCircle className="text-green-500" size={20} />;
      default:
        return <XCircle className="text-red-500" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "serving":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "waiting":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border border-green-200";
      default:
        return "bg-red-100 text-red-700 border border-red-200";
    }
  };

  // Summary counts
  const servingCount = queueItems.filter((q) => q.status === "serving").length;
  const waitingCount = queueItems.filter((q) => q.status === "waiting").length;
  const completedCount = queueItems.filter(
    (q) => q.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12 xl:px-20">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl font-Lexend">
          Real-time Queue Monitoring
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
          <div className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm group rounded-xl hover:shadow-lg">
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="mb-1 text-sm text-gray-600 font-Lexend">
                  Currently Serving
                </p>
                <p className="text-3xl font-bold text-orange-600 font-Lexend">
                  {servingCount}
                </p>
              </div>
              <AlertCircle className="text-orange-500" size={40} />
            </div>
          </div>
          <div className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm group rounded-xl hover:shadow-lg">
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="mb-1 text-sm text-gray-600 font-Lexend">
                  Waiting in Queue
                </p>
                <p className="text-3xl font-bold text-blue-600 font-Lexend">
                  {waitingCount}
                </p>
              </div>
              <Clock className="text-blue-500" size={40} />
            </div>
          </div>
          <div className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-sm group rounded-xl hover:shadow-lg">
            <div className="flex items-center justify-between p-6">
              <div>
                <p className="mb-1 text-sm text-gray-600 font-Lexend">
                  Completed Today
                </p>
                <p className="text-3xl font-bold text-green-600 font-Lexend">
                  {completedCount}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={40} />
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden bg-white border border-gray-200 shadow-sm md:block rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Queue Number
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Service
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Wait Time
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase font-Lexend">
                    Time
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-right text-gray-700 uppercase font-Lexend">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {queueItems.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-all duration-200 group hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent"
                  >
                    <td className="px-6 py-5">
                      <span className="text-lg font-bold text-gray-900 font-Lexend">
                        {item.queueNumber}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <User size={18} className="text-gray-400" />
                        <span className="text-gray-900 font-Lexend">
                          {item.patientName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-Lexend">
                      {item.service}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold font-Lexend ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-Lexend">
                      {item.waitTime}
                    </td>
                    <td className="px-6 py-5 text-gray-700 font-Lexend">
                      {item.timestamp}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === "waiting" && (
                          <button className="px-4 py-2 text-sm font-semibold text-white transition-all duration-200 bg-green-500 rounded-lg hover:bg-green-600 font-Lexend">
                            Call Next
                          </button>
                        )}
                        {item.status === "serving" && (
                          <button className="px-4 py-2 text-sm font-semibold text-white transition-all duration-200 bg-blue-500 rounded-lg hover:bg-blue-600 font-Lexend">
                            Complete
                          </button>
                        )}
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
          {queueItems.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900 font-Lexend">
                    {item.queueNumber}
                  </span>
                  <span className="text-sm text-gray-600 font-Lexend">
                    {item.timestamp}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold font-Lexend ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                  <User size={16} />
                  <span>{item.patientName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                  <span className="font-semibold">Service:</span>
                  <span>{item.service}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-Lexend">
                  <Clock size={16} />
                  <span>{item.waitTime} wait</span>
                </div>
                <div className="flex gap-2 pt-2">
                  {item.status === "waiting" && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white font-semibold bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-200 font-Lexend">
                      Call Next
                    </button>
                  )}
                  {item.status === "serving" && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white font-semibold bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200 font-Lexend">
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {queueItems.length === 0 && (
          <div className="p-12 mt-10 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
              <Clock className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900 font-Lexend">
              No Queue Items
            </h3>
            <p className="mb-6 text-sm text-gray-600 font-Lexend">
              Queue items will appear here in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
