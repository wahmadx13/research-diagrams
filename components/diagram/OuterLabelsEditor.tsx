interface OuterLabelsEditorProps {
  labels: string[];
  onLabelChange: (index: number, text: string) => void;
}

export function OuterLabelsEditor({
  labels,
  onLabelChange,
}: OuterLabelsEditorProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase">
        Outermost Labels
      </label>
      {labels.map((label, idx) => (
        <input
          key={idx}
          type="text"
          value={label}
          onChange={(e) => onLabelChange(idx, e.target.value)}
          className="w-full text-xs p-2 border rounded bg-gray-50"
        />
      ))}
    </div>
  );
}
