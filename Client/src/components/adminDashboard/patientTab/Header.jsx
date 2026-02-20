import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListNumeric } from "@fortawesome/free-solid-svg-icons";
import GenerateQueueModal from "../../modals/GenerateQueueModal";

export default function Header() {
  const [queueTypeModal, setQueueTypeModal] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 mb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl font-Lexend">
            Patients Management
          </h2>
          <p className="text-sm text-gray-600 sm:text-base font-Lexend">
            View and manage patient records
          </p>
        </div>
        <div className="flex justify-end w-full sm:w-auto">
          <button
            onClick={() => setQueueTypeModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 text-green-600 transition-all duration-200 bg-green-100 border-2 border-green-400 cursor-pointer group rounded-xl hover:shadow-lg hover:bg-green-200 font-Lexend whitespace-nowrap ml-auto w-auto sm:w-auto"
            style={{ minWidth: 0 }}
          >
            <FontAwesomeIcon
              icon={faListNumeric}
              className="sm:w-5 sm:h-5 transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>Generate Queue Number</span>
          </button>
        </div>
      </div>

      <GenerateQueueModal
        isOpen={queueTypeModal}
        onClose={() => setQueueTypeModal(false)}
      />
    </>
  );
}
