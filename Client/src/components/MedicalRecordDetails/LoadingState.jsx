export default function LoadingState() {
  return (
    <section className="w-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-16 xl:px-20 lg:py-10">
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
          Loading medical record...
        </p>
      </div>
    </section>
  );
}
