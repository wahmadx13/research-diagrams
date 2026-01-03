import { DiagramData, DiagramConfig, SVG_SIZE } from "@/types/diagram";
import { Markers } from "./Markers";
import { ArchesGroup } from "./ArchesGroup";
import { ChannelText } from "./ChannelText";
import { CenterArea } from "./CenterArea";

interface DiagramSVGProps {
  data: DiagramData;
  config: DiagramConfig;
  onArcSelect: (levelIndex: number, sectorIndex: number) => void;
  onChannelTextChange: (sectorIndex: number, text: string) => void;
  onCenterTextChange: (text: string) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export function DiagramSVG({
  data,
  config,
  onArcSelect,
  onChannelTextChange,
  onCenterTextChange,
  svgRef,
}: DiagramSVGProps) {
  return (
    <div className="bg-white shadow-2xl border">
      <svg
        ref={svgRef}
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className="w-[800px] h-[800px]"
      >
        <Markers />
        {data.levels.map((level, levelIndex) => (
          <ArchesGroup
            key={level.id}
            level={level}
            levelIndex={levelIndex}
            config={config}
            sectors={data.sectors}
            isOutermost={levelIndex === data.levels.length - 1}
            outermostLabels={data.outermostLabels}
            onArcSelect={onArcSelect}
          />
        ))}
        {Array.from({ length: data.sectors }).map((_, sectorIndex) => (
          <ChannelText
            key={`ch-${sectorIndex}`}
            sectorIndex={sectorIndex}
            sectors={data.sectors}
            config={config}
            levelsCount={data.levels.length}
            value={data.channelTexts[`channel-${sectorIndex}`] || ""}
            onChange={onChannelTextChange}
          />
        ))}
        <CenterArea
          centerText={data.centerText}
          config={config}
          onTextChange={onCenterTextChange}
        />
      </svg>
    </div>
  );
}

