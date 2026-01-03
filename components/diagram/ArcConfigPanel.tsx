import { SelectedArc, ArcData } from "@/types/diagram";

interface ArcConfigPanelProps {
  selectedArc: SelectedArc;
  arc: ArcData;
  onUpdate: (
    levelIndex: number,
    sectorIndex: number,
    field: keyof ArcData,
    value: string
  ) => void;
  onDeselect: () => void;
}

export function ArcConfigPanel({
  selectedArc,
  arc,
  onUpdate,
  onDeselect,
}: ArcConfigPanelProps) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
      <textarea
        className="w-full p-2 text-sm border rounded"
        rows={2}
        value={arc.text}
        onChange={(e) =>
          onUpdate(
            selectedArc.levelIndex,
            selectedArc.sectorIndex,
            "text",
            e.target.value
          )
        }
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="color"
          className="w-full h-8"
          value={arc.color}
          onChange={(e) =>
            onUpdate(
              selectedArc.levelIndex,
              selectedArc.sectorIndex,
              "color",
              e.target.value
            )
          }
        />
        <input
          type="color"
          className="w-full h-8"
          value={arc.textColor}
          onChange={(e) =>
            onUpdate(
              selectedArc.levelIndex,
              selectedArc.sectorIndex,
              "textColor",
              e.target.value
            )
          }
        />
      </div>
      <button
        onClick={onDeselect}
        className="w-full text-xs text-blue-500 py-1 underline"
      >
        Deselect
      </button>
    </div>
  );
}
