import { ShapeData } from "@/types/diagram";
import { SingleArrow } from "./SingleArrow";
import { DoubleArrow } from "./DoubleArrow";
import { SingleCurvedArrow } from "./SingleCurvedArrow";
import { DoubleCurvedArrow } from "./DoubleCurvedArrow";

interface ArrowShapeProps {
  shape: ShapeData;
}

export function ArrowShape({ shape }: ArrowShapeProps) {
  const { type, size, color } = shape;

  switch (type) {
    case "single":
      return (
        <SingleArrow width={size.width} height={size.height} color={color} />
      );
    case "double":
      return (
        <DoubleArrow width={size.width} height={size.height} color={color} />
      );
    case "single-curved":
      return (
        <SingleCurvedArrow
          width={size.width}
          height={size.height}
          color={color}
          curveAmount={shape.curveAmount}
        />
      );
    case "double-curved":
      return (
        <DoubleCurvedArrow
          width={size.width}
          height={size.height}
          color={color}
          curveAmount={shape.curveAmount}
        />
      );
    default:
      return null;
  }
}
