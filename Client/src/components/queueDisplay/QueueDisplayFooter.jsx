import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";

export default function QueueDisplayFooter({
  voiceEnabled,
  onEnableVoice,
  onTestAnnouncement,
}) {
  return (
    <footer className="bg-blue-600 text-white py-3 sm:py-4 lg:py-5 px-4 sm:px-8 lg:px-12 shadow-md flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 lg:gap-8 shrink-0">
      <div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-orange-500 shrink-0"></span>
            <span>Now Serving</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
            <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 shrink-0"></span>
            <span>Waiting</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-5">
        <div className="text-xs sm:text-sm lg:text-base font-medium opacity-95 text-center">
          Please wait for your queue number to be called
        </div>
        {voiceEnabled && (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400 animate-pulse shrink-0"></div>
            <span>Voice Enabled</span>
          </div>
        )}
        {!voiceEnabled && (
          <button
            className="flex items-center gap-1.5 sm:gap-2 bg-orange-500 hover:bg-orange-400 text-white px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
            onClick={onEnableVoice}
          >
            <FontAwesomeIcon icon={faBullhorn} />
            <span>Enable Voice</span>
          </button>
        )}
        {voiceEnabled && (
          <button
            className="px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 border-2 border-white/50 hover:border-white/80 rounded-full text-xs sm:text-sm font-semibold hover:scale-105 transition-all"
            onClick={onTestAnnouncement}
          >
            Test Voice
          </button>
        )}
      </div>
    </footer>
  );
}
