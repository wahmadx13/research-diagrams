import { ShapeData } from "@/types/diagram";
import { Trash2 } from "lucide-react";
import { SliderWithInput } from "./SliderWithInput";

interface ShapeConfigPanelProps {
  shape: ShapeData;
  onUpdate: (updates: Partial<ShapeData>) => void;
  onDelete: () => void;
}

export function ShapeConfigPanel({
  shape,
  onUpdate,
  onDelete,
}: ShapeConfigPanelProps) {
  return (
    <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800">
          Arrow Properties
        </h3>
        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-red-50 rounded-md transition-colors group"
          title="Delete arrow"
        >
          <Trash2 size={16} className="text-red-500 group-hover:text-red-700" />
        </button>
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-700 mb-1.5 block flex items-center gap-1.5">
          Arrow Color
          <span
            className="text-[10px] text-gray-400 cursor-help"
            title="The stroke color of the arrow"
          >
            ⓘ
          </span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
            value={shape.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
          />
          <div className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-mono text-gray-700">
            {shape.color}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
            Width
          </label>
          <input
            type="number"
            className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={Math.round(shape.size.width)}
            onChange={(e) =>
              onUpdate({
                size: { ...shape.size, width: parseInt(e.target.value) || 0 },
              })
            }
            min="30"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
            Height
          </label>
          <input
            type="number"
            className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={Math.round(shape.size.height)}
            onChange={(e) => {
              const newHeight = parseInt(e.target.value) || 0;
              const updates: Partial<ShapeData> = {
                size: { ...shape.size, height: newHeight },
              };
              if (
                shape.type === "single-curved" ||
                shape.type === "double-curved"
              ) {
                const heightScale = newHeight / shape.size.height;
                const currentCurveAmount =
                  shape.curveAmount ?? -shape.size.height * 0.5;
                updates.curveAmount = currentCurveAmount * heightScale;
              }
              onUpdate(updates);
            }}
            min="20"
          />
        </div>
      </div>
      <SliderWithInput
        label="Rotation"
        value={Math.round(shape.rotation)}
        min={0}
        max={360}
        onChange={(value) => onUpdate({ rotation: value })}
        tooltip="Rotate the arrow in degrees (0-360)"
      />
      {shape.type === "double-curved" && (
        <SliderWithInput
          label="Curve Depth"
          value={Math.round(shape.curveAmount ?? -shape.size.height * 0.5)}
          min={Math.round(-shape.size.height * 0.8)}
          max={Math.round(shape.size.height * 0.8)}
          onChange={(value) => onUpdate({ curveAmount: value })}
          tooltip="Adjust the curvature depth of the arrow"
        />
      )}
    </div>
  );
}
