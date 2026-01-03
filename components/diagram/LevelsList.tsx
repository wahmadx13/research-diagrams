import { Trash2 } from "lucide-react";
import { LevelData } from "@/types/diagram";

interface LevelsListProps {
  levels: LevelData[];
  onRemove: (id: string) => void;
}

export function LevelsList({ levels, onRemove }: LevelsListProps) {
  return (
    <>
      <label className="text-[10px] font-bold text-gray-400 uppercase">
        Active Rings
      </label>
      <div className="max-h-40 overflow-y-auto space-y-1">
        {levels.map((level, idx) => (
          <div
            key={level.id}
            className="flex items-center justify-between p-2 bg-gray-50 border rounded text-xs"
          >
            <span>Ring {idx + 1}</span>
            <button onClick={() => onRemove(level.id)} className="text-red-400">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
