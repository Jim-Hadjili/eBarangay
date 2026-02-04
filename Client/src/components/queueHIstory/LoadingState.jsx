export default function LoadingState() {
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900"></div>
      <p className="mt-4 text-gray-600 font-medium">
        Loading your queue history...
      </p>
    </div>
  );
}
