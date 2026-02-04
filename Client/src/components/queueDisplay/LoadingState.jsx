export default function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-lime-50">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin"></div>
      <p className="mt-5 text-lg text-teal-600 font-medium">
        Loading queue information...
      </p>
    </div>
  );
}
