import { ShapeData } from "@/types/diagram";
import { DraggableShape } from "./DraggableShape";

interface ShapeRendererProps {
  shapes: ShapeData[];
  selectedShapeId: string | null;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onShapeSelect: (id: string) => void;
  onShapeUpdate: (id: string, updates: Partial<ShapeData>) => void;
  onShapeDelete: (id: string) => void;
}

export function ShapeRenderer({
  shapes,
  selectedShapeId,
  svgRef,
  onShapeSelect,
  onShapeUpdate,
  onShapeDelete,
}: ShapeRendererProps) {
  return (
    <>
      {shapes.map((shape) => (
        <DraggableShape
          key={shape.id}
          shape={shape}
          isSelected={selectedShapeId === shape.id}
          svgRef={svgRef}
          onSelect={() => onShapeSelect(shape.id)}
          onUpdate={(updates) => onShapeUpdate(shape.id, updates)}
          onDelete={() => onShapeDelete(shape.id)}
        />
      ))}
    </>
  );
}

