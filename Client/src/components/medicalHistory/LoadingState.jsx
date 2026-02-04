export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading your medical records...</p>
    </div>
  );
}
