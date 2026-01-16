import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OptionCard = ({
  title,
  description,
  selected = false,
  onSelect,
  icon,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full h-full min-h-35 text-left p-5 rounded-xl border
        transition-all duration-200 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${
          selected
            ? "border-blue-600 bg-blue-50 shadow-md"
            : "border-gray-200 hover:border-green-400 hover:shadow-sm"
        }
      `}
      aria-pressed={selected}
    >
      <div className="flex flex-col items-start gap-4 h-full">
        {icon && (
          <div
            className={`p-2 rounded-lg shrink-0 ${
              selected ? "bg-blue-600 text-white" : "bg-green-500 text-white"
            }`}
          >
            <FontAwesomeIcon icon={icon} size="lg" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-3">
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
};

export default OptionCard;
