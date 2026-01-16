// src/auth/AuthForm.jsx
export default function AuthForm({
  title,
  onSubmit,
  children,
  buttonText,
  success,
  error,
  loading,
  loadingText,
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <img
            src="/images/Logo.png"
            alt="eBarangay Logo"
            className="w-auto h-12 sm:h-14 md:h-16"
          />
          <span className="text-sm sm:text-lg md:text-xl text-gray-800 font-Lexend">
            eBarangay Healthcare
          </span>
        </div>
      </div>

      <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl font-bold text-center text-gray-800 font-Lexend">
        {title}
      </h1>

      {/* Success Message */}
      {success && (
        <div className="p-2.5 sm:p-3 mb-4 text-xs sm:text-sm text-green-700 bg-green-100 border border-green-400 rounded-lg">
          Account created successfully! You can now use your credentials to log
          in.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2.5 sm:p-3 mb-4 text-xs sm:text-sm text-red-700 bg-red-100 border border-red-400 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
        {children}

        <button
          className="w-full cursor-pointer py-2.5 sm:py-3 font-semibold text-sm sm:text-base text-white transition-all transform shadow-lg bg-linear-to-r from-green-400 to-green-500 rounded-xl hover:from-green-500 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          disabled={loading}
        >
          {loading ? loadingText : buttonText}
        </button>
      </form>
    </>
  );
}
