import { DiagramData, DiagramConfig, SVG_SIZE } from "@/types/diagram";
import { Markers } from "./Markers";
import { ArchesGroup } from "./ArchesGroup";
import { ChannelText } from "./ChannelText";
import { CenterArea } from "./CenterArea";
import { ShapeRenderer } from "./shapes/ShapeRenderer";

interface DiagramSVGProps {
  data: DiagramData;
  config: DiagramConfig;
  selectedShapeId: string | null;
  onArcSelect: (levelIndex: number, sectorIndex: number) => void;
  onChannelTextChange: (sectorIndex: number, text: string) => void;
  onCenterTextChange: (text: string) => void;
  onShapeSelect: (id: string) => void;
  onShapeUpdate: (
    id: string,
    updates: Partial<import("@/types/diagram").ShapeData>
  ) => void;
  onShapeDelete: (id: string) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export function DiagramSVG({
  data,
  config,
  selectedShapeId,
  onArcSelect,
  onChannelTextChange,
  onCenterTextChange,
  onShapeSelect,
  onShapeUpdate,
  onShapeDelete,
  svgRef,
}: DiagramSVGProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className="w-full h-full max-w-full max-h-full"
        onClick={(e) => {
          if (
            e.target === e.currentTarget ||
            (e.target as Element).tagName === "svg"
          ) {
            onShapeSelect("");
          }
        }}
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
        <ShapeRenderer
          shapes={data.shapes}
          selectedShapeId={selectedShapeId}
          svgRef={svgRef}
          onShapeSelect={onShapeSelect}
          onShapeUpdate={onShapeUpdate}
          onShapeDelete={onShapeDelete}
        />
      </svg>
    </div>
  );
}
