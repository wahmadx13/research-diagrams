import { DiagramConfig, CENTER } from "@/types/diagram";

const beautifulColors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
  "#14b8a6",
  "#a855f7",
  "#e11d48",
  "#0ea5e9",
  "#22c55e",
  "#fbbf24",
];

function getColorForChannel(sectorIndex: number): string {
  return beautifulColors[sectorIndex % beautifulColors.length];
}

interface ChannelTextProps {
  sectorIndex: number;
  sectors: number;
  config: DiagramConfig;
  levelsCount: number;
  value: string;
  onChange: (sectorIndex: number, text: string) => void;
}

export function ChannelText({
  sectorIndex,
  sectors,
  config,
  levelsCount,
  value,
  onChange,
}: ChannelTextProps) {
  const step = 360 / sectors;
  const angle = (sectorIndex + 1) * step;

  const innerBoundary = config.centerRadius;
  const outerBoundary =
    config.centerRadius +
    levelsCount * (config.levelThickness + config.gapSize);

  const channelHeight = outerBoundary - innerBoundary;
  const width = 30;

  return (
    <g
      key={`ch-${sectorIndex}`}
      transform={`rotate(${angle}, ${CENTER}, ${CENTER})`}
    >
      <foreignObject
        x={CENTER - width / 2}
        y={CENTER - outerBoundary}
        width={width}
        height={channelHeight}
        className="overflow-visible"
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: `${channelHeight}px`,
            height: `${width}px`,
            transformOrigin: "0 0",
            transform: `rotate(90deg) translate(0, -${width}px)`,
          }}
        >
          <input
            className="bg-transparent text-xs sm:text-sm md:text-md lg:text-lg font-bold text-center outline-none border-none hover:bg-blue-100/50 focus:bg-white transition-all w-full tracking-wider"
            placeholder="Sideways"
            style={{
              lineHeight: `${width}px`,
              color: getColorForChannel(sectorIndex),
            }}
            value={value}
            onChange={(e) => onChange(sectorIndex, e.target.value)}
          />
        </div>
      </foreignObject>
    </g>
  );
}
