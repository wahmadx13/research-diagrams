import { LevelData, DiagramConfig } from "@/types/diagram";
import { Arc } from "./Arc";

interface ArchesGroupProps {
  level: LevelData;
  levelIndex: number;
  config: DiagramConfig;
  sectors: number;
  isOutermost: boolean;
  outermostLabels: string[];
  onArcSelect: (levelIndex: number, sectorIndex: number) => void;
}

export function ArchesGroup({
  level,
  levelIndex,
  config,
  sectors,
  isOutermost,
  outermostLabels,
  onArcSelect,
}: ArchesGroupProps) {
  const radius =
    config.centerRadius +
    config.gapSize +
    levelIndex * (config.levelThickness + config.gapSize) +
    config.levelThickness / 2;
  const step = 360 / sectors;
  const angularPadding = (config.arcPadding / radius) * (180 / Math.PI);

  return (
    <g key={level.id}>
      {level.arcs.map((arc, sectorIndex) => {
        const startAngle = sectorIndex * step + angularPadding / 2;
        const endAngle = (sectorIndex + 1) * step - angularPadding / 2;

        return (
          <Arc
            key={`${levelIndex}-${sectorIndex}`}
            arc={arc}
            levelIndex={levelIndex}
            sectorIndex={sectorIndex}
            radius={radius}
            startAngle={startAngle}
            endAngle={endAngle}
            levelThickness={config.levelThickness}
            isOutermost={isOutermost}
            outerLabel={outermostLabels[sectorIndex] || ""}
            onSelect={() => onArcSelect(levelIndex, sectorIndex)}
          />
        );
      })}
    </g>
  );
}
