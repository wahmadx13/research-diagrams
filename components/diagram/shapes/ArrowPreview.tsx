import { ShapeType } from "@/types/diagram";
import { SingleArrow } from "./SingleArrow";
import { DoubleArrow } from "./DoubleArrow";
import { SingleCurvedArrow } from "./SingleCurvedArrow";
import { DoubleCurvedArrow } from "./DoubleCurvedArrow";

interface ArrowPreviewProps {
  type: ShapeType;
  width?: number;
  height?: number;
  color?: string;
}

export function ArrowPreview({
  type,
  width = 60,
  height = 20,
  color = "#3b82f6",
}: ArrowPreviewProps) {
  const props = { width, height, color };

  switch (type) {
    case "single":
      return <SingleArrow {...props} />;
    case "double":
      return <DoubleArrow {...props} />;
    case "single-curved":
      return <SingleCurvedArrow {...props} />;
    case "double-curved":
      return <DoubleCurvedArrow {...props} />;
    default:
      return null;
  }
}
