import { createStraightArrowPath } from "@/utils/shapes";

interface DoubleArrowProps {
  width: number;
  height: number;
  color: string;
}

export function DoubleArrow({ width, height, color }: DoubleArrowProps) {
  const path = createStraightArrowPath(width, height, true);
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

