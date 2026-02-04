import { Users } from "lucide-react";

export default function NoActiveQueues() {
  return (
    <div className="p-12 text-center bg-gray-50 border border-gray-200 rounded-xl">
      <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-white rounded-full shadow-sm">
        <Users className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-900 font-Lexend">
        No Active Queues
      </h3>
      <p className="text-sm text-gray-600 font-Lexend">
        There are no customers waiting in any queue at the moment.
      </p>
    </div>
  );
}
