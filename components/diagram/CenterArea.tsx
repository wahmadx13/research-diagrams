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
        fill="#fff"
        stroke="#ccc"
      />
      <foreignObject
        x={CENTER - config.centerRadius}
        y={CENTER - config.centerRadius}
        width={config.centerRadius * 2}
        height={config.centerRadius * 2}
      >
        <div className="w-full h-full flex items-center justify-center">
          <textarea
            className="bg-transparent text-center font-bold text-xs w-full outline-none resize-none"
            value={centerText}
            onChange={(e) => onTextChange(e.target.value)}
          />
        </div>
      </foreignObject>
    </>
  );
}
