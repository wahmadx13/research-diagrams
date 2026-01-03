interface OuterLabelsEditorProps {
  labels: string[];
  onLabelChange: (index: number, text: string) => void;
}

export function OuterLabelsEditor({
  labels,
  onLabelChange,
}: OuterLabelsEditorProps) {
  return (
    <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm space-y-3">
      <label className="text-xs font-semibold text-gray-700 block">
        Outermost Labels
      </label>
      <div className="space-y-2">
        {labels.map((label, idx) => (
          <input
            key={idx}
            type="text"
            value={label}
            onChange={(e) => onLabelChange(idx, e.target.value)}
            className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            placeholder={`Label ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
