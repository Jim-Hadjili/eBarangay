import { memo, useCallback } from "react";

function FormField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  required = false,
}) {
  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div>
      <label className="flex items-center gap-1.5 mb-2 text-sm font-bold text-gray-800">
        {label}
        {required && <span className="text-sm text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 h-26 text-base leading-relaxed border rounded-lg  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
          error
            ? "border-red-400 bg-red-50/50 focus:ring-red-500"
            : "border-gray-300 bg-white focus:ring-blue-500 hover:border-gray-400"
        }`}
      />
      {error && (
        <p className="flex items-center gap-1 mt-2 text-base font-medium text-red-600 ">
          <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
          {error}
        </p>
      )}
    </div>
  );
}

export default memo(FormField);
