export interface ArcData {
  text: string;
  color: string;
  textColor: string;
}

export interface LevelData {
  id: string;
  arcs: ArcData[];
}

export interface ArrowData {
  id: number;
  type: ArrowType;
  startAngle: number;
  endAngle: number;
  radius: number;
  color: string;
  offsetX: number;
  offsetY: number;
}

export interface GapLabel {
  id: string;
  text: string;
  angle: number;
  levelIndex: number;
}

export interface DiagramState {
  centerText: string;
  sectors: number;
  levels: LevelData[];
  arrows: ArrowData[];
  gapLabels: GapLabel[];
  outerLabels: string[];
}

export type ArrowType = "single" | "double" | "curved";

export interface DiagramData {
  centerText: string;
  sectors: number;
  levels: LevelData[];
  channelTexts: Record<string, string>;
  outermostLabels: string[];
  arrows: ArrowData[];
}

export interface DiagramConfig {
  gapSize: number;
  levelThickness: number;
  centerRadius: number;
  arcPadding: number;
}

export interface SelectedArc {
  levelIndex: number;
  sectorIndex: number;
}

export const SVG_SIZE = 1000;
export const CENTER = SVG_SIZE / 2;
