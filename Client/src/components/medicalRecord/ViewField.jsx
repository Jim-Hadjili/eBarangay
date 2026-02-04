import { memo } from "react";

function ViewField({ label, value }) {
  if (!value) return null;

  return (
    <div>
      <div className="text-xs sm:text-xs font-bold text-gray-700 uppercase mb-1.5 sm:mb-2 tracking-wide">
        {label}
      </div>
      <div className="p-2.5 sm:p-3 bg-white rounded-lg border border-gray-200">
        <p className="text-sm sm:text-base text-gray-900 leading-relaxed whitespace-pre-wrap break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

export default memo(ViewField);
