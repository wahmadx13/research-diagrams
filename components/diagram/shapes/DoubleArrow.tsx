interface DoubleArrowProps {
  width: number;
  height: number;
  color: string;
}

export function DoubleArrow({ width, height, color }: DoubleArrowProps) {
  const strokeWidth = Math.max(1.5, Math.min(height * 0.08, 2.5));
  const arrowHeadSize = Math.min(width * 0.12, height * 0.4);
  const centerY = height / 2;
  const lineStartX = arrowHeadSize;
  const lineEndX = width - arrowHeadSize;

  return (
    <g>
      <line
        x1={lineStartX}
        y1={centerY}
        x2={lineEndX}
        y2={centerY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <polygon
        points={`0,${centerY} ${arrowHeadSize},${
          centerY - arrowHeadSize / 2
        } ${arrowHeadSize},${centerY + arrowHeadSize / 2}`}
        fill={color}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <polygon
        points={`${width},${centerY} ${width - arrowHeadSize},${
          centerY - arrowHeadSize / 2
        } ${width - arrowHeadSize},${centerY + arrowHeadSize / 2}`}
        fill={color}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </g>
  );
}
