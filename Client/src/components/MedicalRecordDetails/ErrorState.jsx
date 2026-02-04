export default function ErrorState({ error, onBack }) {
  return (
    <section className="w-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-16 xl:px-20 lg:py-10">
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
        <div className="p-4 sm:p-6 bg-red-50 rounded-full mb-3 sm:mb-4">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 text-center px-4">
          Unable to Load Record
        </h3>
        <p className="text-sm sm:text-base text-gray-500 text-center max-w-md mb-4 px-4">
          {error || "The medical record could not be found."}
        </p>
        <button
          onClick={onBack}
          className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200 min-h-11 active:scale-95"
        >
          Back to Medical History
        </button>
      </div>
    </section>
  );
}
