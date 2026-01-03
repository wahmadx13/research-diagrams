import { DiagramConfig, CENTER } from "@/types/diagram";

interface CenterAreaProps {
  centerText: string;
  config: DiagramConfig;
  onTextChange: (text: string) => void;
}

export function CenterArea({
  centerText,
  config,
  onTextChange,
}: CenterAreaProps) {
  return (
    <>
      <circle
        cx={CENTER}
        cy={CENTER}
        r={config.centerRadius}
        fill="oklch(65.6% 0.241 354.308)"
        // stroke="#ccc"
      />
      <foreignObject
        x={CENTER - config.centerRadius}
        y={CENTER - config.centerRadius}
        width={config.centerRadius * 2}
        height={config.centerRadius * 2}
      >
        <div className="w-full h-full flex items-center justify-center">
          <textarea
            className="bg-transparent text-center font-bold text-lg sm:text-md md:text-xl lg:text-2xl w-full outline-none resize-none text-white"
            value={centerText}
            onChange={(e) => onTextChange(e.target.value)}
          />
        </div>
      </foreignObject>
    </>
  );
}
