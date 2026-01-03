import { createCurvedArrowPath } from "@/utils/shapes";

interface SingleCurvedArrowProps {
  width: number;
  height: number;
  color: string;
}

export function SingleCurvedArrow({
  width,
  height,
  color,
}: SingleCurvedArrowProps) {
  const path = createCurvedArrowPath(width, height, false);
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

