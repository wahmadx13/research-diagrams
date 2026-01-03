import { ShapeData } from "@/types/diagram";

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
    <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold">Shape Properties</span>
        <button
          onClick={onDelete}
          className="text-xs text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
      <div>
        <label className="text-[10px] text-gray-400 uppercase">Color</label>
        <input
          type="color"
          className="w-full h-8 mt-1"
          value={shape.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-gray-400 uppercase">Width</label>
          <input
            type="number"
            className="w-full text-xs p-1 border rounded"
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
          <label className="text-[10px] text-gray-400 uppercase">Height</label>
          <input
            type="number"
            className="w-full text-xs p-1 border rounded"
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
      <div>
        <label className="text-[10px] text-gray-400 uppercase">Rotation</label>
        <input
          type="range"
          min="0"
          max="360"
          value={Math.round(shape.rotation)}
          onChange={(e) => onUpdate({ rotation: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-center text-gray-500 mt-1">
          {Math.round(shape.rotation)}°
        </div>
      </div>
      {shape.type === "double-curved" && (
        <div>
          <label className="text-[10px] text-gray-400 uppercase">
            Curve Height
          </label>
          <input
            type="range"
            min={-shape.size.height * 0.8}
            max={shape.size.height * 0.8}
            value={shape.curveAmount ?? -shape.size.height * 0.5}
            onChange={(e) =>
              onUpdate({ curveAmount: parseFloat(e.target.value) })
            }
            className="w-full"
          />
          <div className="text-xs text-center text-gray-500 mt-1">
            {Math.round(shape.curveAmount ?? -shape.size.height * 0.5)}
          </div>
        </div>
      )}
    </div>
  );
}
