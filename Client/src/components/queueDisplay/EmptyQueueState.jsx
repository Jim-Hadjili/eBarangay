export default function EmptyQueueState() {
  return (
    <div className="text-center py-12 sm:py-16 lg:py-24">
      <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600">
        No active queues at the moment
      </p>
      <p className="text-base sm:text-lg lg:text-xl text-gray-400 mt-2">
        Please check back later
      </p>
    </div>
  );
}
