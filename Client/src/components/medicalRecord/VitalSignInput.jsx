import { memo, useCallback } from "react";

function VitalSignInput({ label, value, onChange, onBlur, placeholder }) {
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className="group">
      <label className="block mb-1.5 text-xs text-gray-700 font-bold">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all bg-white"
      />
    </div>
  );
}

export default memo(VitalSignInput);
