import QueueHistoryItem from "./QueueHistoryItem";

export default function QueueHistoryList({ queueHistory }) {
  return (
    <div className="relative space-y-0">
      {/* Vertical timeline line */}
      <div className="absolute left-1.5 top-4 bottom-4 w-0.5 bg-gray-200"></div>

      {queueHistory.map((queue) => (
        <QueueHistoryItem key={queue._id} queue={queue} />
      ))}
    </div>
  );
}
