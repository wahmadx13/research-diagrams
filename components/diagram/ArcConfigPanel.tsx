import { SelectedArc, ArcData } from "@/types/diagram";
import { X } from "lucide-react";

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
    <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Arc Properties</h3>
        <button
          onClick={onDeselect}
          className="p-1 hover:bg-gray-200 rounded-md transition-colors"
          title="Deselect"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
          Text Content
        </label>
        <textarea
          className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
            Background Color
            <span
              className="text-[10px] text-gray-400 cursor-help"
              title="The fill color of the arc segment"
            >
              ⓘ
            </span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
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
            <div className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono text-gray-700">
              {arc.color}
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
            Text Color
            <span
              className="text-[10px] text-gray-400 cursor-help"
              title="The color of the text inside the arc"
            >
              ⓘ
            </span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
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
            <div className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono text-gray-700">
              {arc.textColor}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
