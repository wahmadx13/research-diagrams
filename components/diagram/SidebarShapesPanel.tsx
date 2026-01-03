import { ArrowRight, ArrowLeftRight, ArrowRightLeft, ArrowLeft } from "lucide-react";
import { ShapeType } from "@/types/diagram";

interface SidebarShapesPanelProps {
  onAddShape: (type: ShapeType) => void;
}

export function SidebarShapesPanel({ onAddShape }: SidebarShapesPanelProps) {
  return (
    <div className="space-y-2 pt-2 border-t">
      <label className="text-[10px] font-bold text-gray-400 uppercase">
        Add Arrows
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onAddShape("single")}
          className="p-3 border rounded hover:bg-gray-50 flex flex-col items-center gap-1 text-xs"
          title="Single Arrow"
        >
          <ArrowRight size={20} className="text-gray-600" />
          <span>Single</span>
        </button>
        <button
          onClick={() => onAddShape("double")}
          className="p-3 border rounded hover:bg-gray-50 flex flex-col items-center gap-1 text-xs"
          title="Double Arrow"
        >
          <ArrowLeftRight size={20} className="text-gray-600" />
          <span>Double</span>
        </button>
        <button
          onClick={() => onAddShape("single-curved")}
          className="p-3 border rounded hover:bg-gray-50 flex flex-col items-center gap-1 text-xs"
          title="Single Curved Arrow"
        >
          <ArrowRightLeft size={20} className="text-gray-600" />
          <span>Curved</span>
        </button>
        <button
          onClick={() => onAddShape("double-curved")}
          className="p-3 border rounded hover:bg-gray-50 flex flex-col items-center gap-1 text-xs"
          title="Double Curved Arrow"
        >
          <ArrowLeft size={20} className="text-gray-600" />
          <span>Double Curved</span>
        </button>
      </div>
    </div>
  );
}

