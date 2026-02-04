import { memo, useCallback } from "react";
import { Trash2 } from "lucide-react";

function PrescriptionItem({
  value,
  onChange,
  onRemove,
  placeholder = "Enter prescription or medication...",
}) {
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white hover:border-blue-300 transition-all group">
      <div className="shrink-0 w-2 h-2 rounded-full bg-blue-500"></div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 px-3 py-2.5 text-base border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all"
      />
      <button
        onClick={onRemove}
        type="button"
        className="shrink-0 p-2 text-gray-400 transition-all hover:text-red-600 hover:bg-red-50 rounded-lg group-hover:text-red-500 active:scale-95"
        title="Remove prescription"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default memo(PrescriptionItem);
