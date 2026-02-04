import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function BackButton({ onClick, text = "Back" }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center mb-3 sm:mb-4 md:mb-6 justify-center gap-2 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-600 transition-all duration-200 bg-gray-100 border-2 border-gray-400 cursor-pointer group rounded-lg sm:rounded-xl hover:shadow-lg hover:bg-gray-200 font-Lexend whitespace-nowrap min-h-[44px] active:scale-95"
    >
      <FontAwesomeIcon
        icon={faArrowLeft}
        className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:-translate-x-1"
      />
      <span className="hidden md:inline">{text}</span>
      <span className="md:hidden">Back</span>
    </button>
  );
}
