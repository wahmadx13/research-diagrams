import { createCurvedArrowPath } from "@/utils/shapes";

interface DoubleCurvedArrowProps {
  width: number;
  height: number;
  color: string;
}

export function DoubleCurvedArrow({
  width,
  height,
  color,
}: DoubleCurvedArrowProps) {
  const path = createCurvedArrowPath(width, height, true);
  return (
    <path
      d={path}
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

