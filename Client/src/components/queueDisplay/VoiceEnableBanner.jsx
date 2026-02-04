import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";

export default function VoiceEnableBanner({ onEnableVoice }) {
  return (
    <div
      className="bg-linear-to-r from-orange-500 to-orange-400 text-white py-3 sm:py-4 lg:py-5 px-4 sm:px-8 lg:px-12 cursor-pointer sticky top-0 z-50 shadow-lg animate-pulse hover:from-orange-400 hover:to-orange-300 hover:scale-[1.01] transition-all"
      onClick={onEnableVoice}
    >
      <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-5 max-w-4xl mx-auto">
        <FontAwesomeIcon
          icon={faBullhorn}
          className="text-2xl sm:text-3xl lg:text-4xl animate-bounce"
        />
        <div>
          <strong className="block text-base sm:text-lg lg:text-xl mb-0.5 sm:mb-1">
            Click here to enable voice announcements
          </strong>
          <p className="text-xs sm:text-sm opacity-95">
            You'll hear audio alerts when patients are called
          </p>
        </div>
      </div>
    </div>
  );
}
