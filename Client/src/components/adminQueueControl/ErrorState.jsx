export default function ErrorState({ error, onBackToDashboard }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 text-center bg-white rounded-xl shadow-lg max-w-md">
        <p className="text-red-600 font-Lexend">{error}</p>
        <button
          onClick={onBackToDashboard}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-Lexend"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
