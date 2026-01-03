import { Download } from "lucide-react";
import {
  DiagramData,
  DiagramConfig,
  SelectedArc,
  ArcData,
  ShapeType,
} from "@/types/diagram";
import { LevelsList } from "./LevelsList";
import { OuterLabelsEditor } from "./OuterLabelsEditor";
import { ArcConfigPanel } from "./ArcConfigPanel";
import { SidebarShapesPanel } from "./SidebarShapesPanel";
import { ShapeConfigPanel } from "./ShapeConfigPanel";

interface SidebarProps {
  data: DiagramData;
  config: DiagramConfig;
  selectedArc: SelectedArc | null;
  selectedShapeId: string | null;
  onSectorCountChange: (count: number) => void;
  onOuterLabelChange: (index: number, text: string) => void;
  onConfigChange: (updates: Partial<DiagramConfig>) => void;
  onAddLevel: () => void;
  onRemoveLevel: (id: string) => void;
  onArcUpdate: (
    levelIndex: number,
    sectorIndex: number,
    field: keyof ArcData,
    value: string
  ) => void;
  onDeselectArc: () => void;
  onAddShape: (type: ShapeType) => void;
  onShapeUpdate: (id: string, updates: Partial<import("@/types/diagram").ShapeData>) => void;
  onShapeDelete: (id: string) => void;
  onDeselectShape: () => void;
  onDownloadPNG: () => void;
}

export function Sidebar({
  data,
  config,
  selectedArc,
  selectedShapeId,
  onSectorCountChange,
  onOuterLabelChange,
  onConfigChange,
  onAddLevel,
  onRemoveLevel,
  onArcUpdate,
  onDeselectArc,
  onAddShape,
  onShapeUpdate,
  onShapeDelete,
  onDeselectShape,
  onDownloadPNG,
}: SidebarProps) {
  return (
    <div className="w-80 bg-white border-r p-5 overflow-y-auto flex flex-col gap-6 shadow-sm">
      <h1 className="text-xl font-bold">Diagram Studio</h1>
      <div className="space-y-4">
        <LevelsList levels={data.levels} onRemove={onRemoveLevel} />
        <div className="flex justify-between items-center text-sm font-semibold">
          <span>Sectors</span>
          <input
            type="number"
            value={data.sectors}
            onChange={(e) => onSectorCountChange(parseInt(e.target.value))}
            className="w-16 border rounded p-1 text-center"
          />
        </div>
        <OuterLabelsEditor
          labels={data.outermostLabels}
          onLabelChange={onOuterLabelChange}
        />
        <div className="space-y-2 pt-2 border-t">
          <label className="text-[10px]">Arch Gap (Linear Pixels)</label>
          <input
            type="range"
            min="2"
            max="100"
            value={config.arcPadding}
            onChange={(e) =>
              onConfigChange({ arcPadding: parseInt(e.target.value) })
            }
            className="w-full"
          />
          <label className="text-[10px]">Ring Gap</label>
          <input
            type="range"
            min="0"
            max="100"
            value={config.gapSize}
            onChange={(e) =>
              onConfigChange({ gapSize: parseInt(e.target.value) })
            }
            className="w-full"
          />
        </div>
        <button
          onClick={onAddLevel}
          className="w-full py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs font-bold"
        >
          + Add Level
        </button>
        <SidebarShapesPanel onAddShape={onAddShape} />
      </div>
      {selectedArc && (
        <ArcConfigPanel
          selectedArc={selectedArc}
          arc={
            data.levels[selectedArc.levelIndex].arcs[selectedArc.sectorIndex]
          }
          onUpdate={onArcUpdate}
          onDeselect={onDeselectArc}
        />
      )}
      {selectedShapeId && (() => {
        const shape = data.shapes.find((s) => s.id === selectedShapeId);
        return shape ? (
          <ShapeConfigPanel
            shape={shape}
            onUpdate={(updates) => onShapeUpdate(selectedShapeId, updates)}
            onDelete={() => {
              onShapeDelete(selectedShapeId);
              onDeselectShape();
            }}
          />
        ) : null;
      })()}
      <button
        onClick={onDownloadPNG}
        className="mt-auto w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
      >
        <Download size={20} /> Export PNG
      </button>
    </div>
  );
}
