export default function ErrorAlert({ error }) {
  if (!error) return null;
  return (
    <div className="p-4 mb-6 border-l-4 border-red-500 rounded-lg shadow-sm sm:mb-8 sm:p-5 bg-red-50">
      <div className="flex items-start">
        <div className="shrink-0">
          <svg
            className="w-5 h-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">
            Error loading dashboard data: {error}
          </p>
        </div>
      </div>
    </div>
  );
}
