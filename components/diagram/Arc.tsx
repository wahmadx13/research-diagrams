import { describeTextArc } from "@/utils/geometry";
import { ArcData, CENTER } from "@/types/diagram";

interface ArcProps {
  arc: ArcData;
  levelIndex: number;
  sectorIndex: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  levelThickness: number;
  isOutermost: boolean;
  outerLabel: string;
  onSelect: () => void;
}

export function Arc({
  arc,
  levelIndex,
  sectorIndex,
  radius,
  startAngle,
  endAngle,
  levelThickness,
  isOutermost,
  outerLabel,
  onSelect,
}: ArcProps) {
  const path = describeTextArc(CENTER, CENTER, radius, startAngle, endAngle);
  const labelPath = describeTextArc(
    CENTER,
    CENTER,
    radius + levelThickness / 2 + 15,
    startAngle,
    endAngle
  );

  return (
    <g
      key={`${levelIndex}-${sectorIndex}`}
      className="cursor-pointer"
      onClick={onSelect}
    >
      <path
        d={path.d}
        fill="none"
        stroke={arc.color}
        strokeWidth={levelThickness}
      />
      <path id={`p-${levelIndex}-${sectorIndex}`} d={path.d} fill="none" />
      <text
        fill={arc.textColor}
        className="text-lg sm:text-md md:text-xl lg:text-2xl font-bold pointer-events-none"
      >
        <textPath
          href={`#p-${levelIndex}-${sectorIndex}`}
          startOffset="50%"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {arc.text}
        </textPath>
      </text>
      {isOutermost && (
        <>
          <path id={`ol-${sectorIndex}`} d={labelPath.d} fill="none" />
          <text
            fill="#94a3b8"
            className="text-lg sm:text-md md:text-xl lg:text-2xl font-bold pointer-events-none"
          >
            <textPath
              href={`#ol-${sectorIndex}`}
              startOffset="50%"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {outerLabel}
            </textPath>
          </text>
        </>
      )}
    </g>
  );
}
