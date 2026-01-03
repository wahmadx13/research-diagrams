import { createStraightArrowPath } from "@/utils/shapes";

interface SingleArrowProps {
  width: number;
  height: number;
  color: string;
}

export function SingleArrow({ width, height, color }: SingleArrowProps) {
  const path = createStraightArrowPath(width, height, false);
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

