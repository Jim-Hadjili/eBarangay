import { memo, useCallback } from "react";
import { Pill, Plus } from "lucide-react";
import PrescriptionItem from "./PrescriptionItem";

function PrescriptionsSection({ prescriptions, onAdd, onUpdate, onRemove }) {
  const createUpdateHandler = useCallback(
    (index) => {
      return (value) => onUpdate(index, value);
    },
    [onUpdate],
  );

  const createRemoveHandler = useCallback(
    (index) => {
      return () => onRemove(index);
    },
    [onRemove],
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100">
            <Pill className="w-4 h-4 text-blue-600" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 font-Lexend">
            Prescriptions
          </h4>
        </div>
        <button
          onClick={onAdd}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
      {prescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
          <Pill className="w-6 h-6 mb-1 text-gray-400" />
          <p className="text-xs text-gray-500 font-Lexend">
            No prescriptions added yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((prescription, index) => (
            <PrescriptionItem
              key={index}
              value={prescription}
              onChange={createUpdateHandler(index)}
              onRemove={createRemoveHandler(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(PrescriptionsSection);
