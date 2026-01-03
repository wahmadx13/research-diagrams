import { DiagramConfig, CENTER } from "@/types/diagram";

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
            className="bg-transparent text-[10px] font-bold text-center outline-none border-none hover:bg-blue-100/50 focus:bg-white transition-all w-full uppercase tracking-wider"
            placeholder="TYPE HERE..."
            style={{
              lineHeight: `${width}px`,
            }}
            value={value}
            onChange={(e) => onChange(sectorIndex, e.target.value)}
          />
        </div>
      </foreignObject>
    </g>
  );
}
