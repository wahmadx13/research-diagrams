interface SingleArrowProps {
  width: number;
  height: number;
  color: string;
}

export function SingleArrow({ width, height, color }: SingleArrowProps) {
  const strokeWidth = Math.max(1.5, Math.min(height * 0.08, 2.5));
  const arrowHeadSize = Math.min(width * 0.15, height * 0.5);
  const centerY = height / 2;
  const lineStartX = 0;
  const lineEndX = width - arrowHeadSize;
  const arrowTipX = width;

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
        points={`${arrowTipX},${centerY} ${lineEndX},${
          centerY - arrowHeadSize / 2
        } ${lineEndX},${centerY + arrowHeadSize / 2}`}
        fill={color}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </g>
  );
}
