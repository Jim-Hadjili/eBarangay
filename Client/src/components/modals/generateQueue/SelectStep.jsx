import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListNumeric,
  faUserCheck,
  faUserPlus,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Initial step that lets the admin choose between an existing (registered)
 * patient or a new walk-in (unregistered) patient.
 *
 * @param {{ onExistingPatient: () => void, onUnregisteredPatient: () => void }} props
 */
export default function SelectStep({
  onExistingPatient,
  onUnregisteredPatient,
}) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-3 shadow-sm border-2 border-green-300">
          <FontAwesomeIcon
            icon={faListNumeric}
            className="text-2xl text-green-600"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 font-Lexend">
          Generate Queue Number
        </h3>
        <p className="text-sm text-gray-500 mt-1 font-Lexend">
          Select the type of patient to generate a queue number for
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {/* Existing Patient */}
        <button
          onClick={onExistingPatient}
          className="group flex items-center gap-4 w-full px-5 py-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 text-left cursor-pointer"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 group-hover:bg-blue-200 transition-colors flex-shrink-0">
            <FontAwesomeIcon
              icon={faUserCheck}
              className="text-xl text-blue-600"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 font-Lexend">
              Existing Patient
            </p>
            <p className="text-xs text-gray-500 font-Lexend mt-0.5">
              Registered patient with an account in the system
            </p>
          </div>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-blue-400 text-sm group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0"
          />
        </button>

        {/* Unregistered Patient */}
        <button
          onClick={onUnregisteredPatient}
          className="group flex items-center gap-4 w-full px-5 py-4 rounded-xl border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 transition-all duration-200 text-left cursor-pointer"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 border border-orange-300 group-hover:bg-orange-200 transition-colors flex-shrink-0">
            <FontAwesomeIcon
              icon={faUserPlus}
              className="text-xl text-orange-600"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 font-Lexend">
              Unregistered Patient
            </p>
            <p className="text-xs text-gray-500 font-Lexend mt-0.5">
              Walk-in patient without a system account
            </p>
          </div>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-orange-400 text-sm group-hover:translate-x-1 transition-transform duration-200 flex-shrink-0"
          />
        </button>
      </div>
    </div>
  );
}
