"use client";

import { useState, useRef, useCallback } from "react";
import { Download, Trash2 } from "lucide-react";
import { describeTextArc } from "@/utils/geometry";
import { ArrowData, ArcData, SVG_SIZE, CENTER } from "@/types/diagram";

export default function ConcentricDesigner() {
  const [data, setData] = useState({
    centerText: "Center\nTopic",
    sectors: 4,
    levels: [
      {
        id: "lvl-1",
        arcs: [
          { text: "Option 1", color: "#e2e8f0", textColor: "#1e293b" },
          { text: "Option 2", color: "#e2e8f0", textColor: "#1e293b" },
          { text: "Option 3", color: "#e2e8f0", textColor: "#1e293b" },
          { text: "Option 4", color: "#e2e8f0", textColor: "#1e293b" },
        ],
      },
    ],
    channelTexts: {} as Record<string, string>,
    outermostLabels: ["Label A", "Label B", "Label C", "Label D"] as string[],
    arrows: [] as ArrowData[],
  });

  const [config, setConfig] = useState({
    gapSize: 20,
    levelThickness: 60,
    centerRadius: 70,
    arcPadding: 10,
  });

  const [selectedArc, setSelectedArc] = useState<{
    levelIndex: number;
    sectorIndex: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // --- ACTIONS ---
  const updateChannelText = (sectorIdx: number, text: string) => {
    setData((prev) => ({
      ...prev,
      channelTexts: { ...prev.channelTexts, [`channel-${sectorIdx}`]: text },
    }));
  };

  const updateOuterLabel = (sectorIdx: number, text: string) => {
    const newLabels = [...data.outermostLabels];
    newLabels[sectorIdx] = text;
    setData((prev) => ({ ...prev, outermostLabels: newLabels }));
  };

  const addLevel = () => {
    const newArcs = Array(data.sectors)
      .fill(null)
      .map(() => ({ text: "New", color: "#e2e8f0", textColor: "#333" }));
    setData((prev) => ({
      ...prev,
      levels: [...prev.levels, { id: `lvl-${Date.now()}`, arcs: newArcs }],
    }));
  };

  const removeLevel = (id: string) => {
    setData((prev) => ({
      ...prev,
      levels: prev.levels.filter((lvl) => lvl.id !== id),
    }));
    setSelectedArc(null);
  };

  const updateArc = (
    l: number,
    s: number,
    field: keyof ArcData,
    value: string
  ) => {
    const nl = [...data.levels];
    nl[l].arcs[s] = { ...nl[l].arcs[s], [field]: value };
    setData({ ...data, levels: nl });
  };

  const updateSectorCount = (count: number) => {
    const n = Math.max(1, Math.min(12, count));
    setData((prev) => {
      const newLabels = [...prev.outermostLabels];
      while (newLabels.length < n)
        newLabels.push(`Label ${newLabels.length + 1}`);
      return {
        ...prev,
        sectors: n,
        outermostLabels: newLabels.slice(0, n),
        levels: prev.levels.map((lvl) => ({
          ...lvl,
          arcs: Array(n)
            .fill(null)
            .map(
              (_, i) =>
                lvl.arcs[i] || {
                  text: "New",
                  color: "#e2e8f0",
                  textColor: "#333",
                }
            ),
        })),
      };
    });
  };

  const downloadPNG = useCallback(() => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = SVG_SIZE;
      canvas.height = SVG_SIZE;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, SVG_SIZE, SVG_SIZE);
        ctx.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.download = "export.png";
        link.href = canvas.toDataURL();
        link.click();
      }
    };
    img.src =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(source)));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <div className="w-80 bg-white border-r p-5 overflow-y-auto flex flex-col gap-6 shadow-sm">
        <h1 className="text-xl font-bold">Diagram Studio</h1>
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-gray-400 uppercase">
            Active Rings
          </label>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {data.levels.map((lvl, idx) => (
              <div
                key={lvl.id}
                className="flex items-center justify-between p-2 bg-gray-50 border rounded text-xs"
              >
                <span>Ring {idx + 1}</span>
                <button
                  onClick={() => removeLevel(lvl.id)}
                  className="text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-sm font-semibold">
            <span>Sectors</span>
            <input
              type="number"
              value={data.sectors}
              onChange={(e) => updateSectorCount(parseInt(e.target.value))}
              className="w-16 border rounded p-1 text-center"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              Outermost Labels
            </label>
            {data.outermostLabels.map((label, idx) => (
              <input
                key={idx}
                type="text"
                value={label}
                onChange={(e) => updateOuterLabel(idx, e.target.value)}
                className="w-full text-xs p-2 border rounded bg-gray-50"
              />
            ))}
          </div>
          <div className="space-y-2 pt-2 border-t">
            <label className="text-[10px]">Arch Gap (Linear Pixels)</label>
            <input
              type="range"
              min="2"
              max="100"
              value={config.arcPadding}
              onChange={(e) =>
                setConfig({ ...config, arcPadding: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <label className="text-[10px]">Ring Gap</label>
            <input
              type="range"
              min="0"
              max="100"
              value={config.gapSize}
              onChange={(e) =>
                setConfig({ ...config, gapSize: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <button
            onClick={addLevel}
            className="w-full py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs font-bold"
          >
            + Add Level
          </button>
        </div>
        {selectedArc && (
          <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
            <textarea
              className="w-full p-2 text-sm border rounded"
              rows={2}
              value={
                data.levels[selectedArc.levelIndex].arcs[
                  selectedArc.sectorIndex
                ].text
              }
              onChange={(e) =>
                updateArc(
                  selectedArc.levelIndex,
                  selectedArc.sectorIndex,
                  "text",
                  e.target.value
                )
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="color"
                className="w-full h-8"
                value={
                  data.levels[selectedArc.levelIndex].arcs[
                    selectedArc.sectorIndex
                  ].color
                }
                onChange={(e) =>
                  updateArc(
                    selectedArc.levelIndex,
                    selectedArc.sectorIndex,
                    "color",
                    e.target.value
                  )
                }
              />
              <input
                type="color"
                className="w-full h-8"
                value={
                  data.levels[selectedArc.levelIndex].arcs[
                    selectedArc.sectorIndex
                  ].textColor
                }
                onChange={(e) =>
                  updateArc(
                    selectedArc.levelIndex,
                    selectedArc.sectorIndex,
                    "textColor",
                    e.target.value
                  )
                }
              />
            </div>
            <button
              onClick={() => setSelectedArc(null)}
              className="w-full text-xs text-blue-500 py-1 underline"
            >
              Deselect
            </button>
          </div>
        )}
        <button
          onClick={downloadPNG}
          className="mt-auto w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <Download size={20} /> Export PNG
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-10 overflow-auto">
        <div className="bg-white shadow-2xl border">
          <svg
            ref={svgRef}
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            className="w-[800px] h-[800px]"
          >
            <defs>
              <marker
                id="head-end"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
              </marker>
              <marker
                id="head-start"
                markerWidth="10"
                markerHeight="7"
                refX="1"
                refY="3.5"
                orient="auto"
              >
                <polygon points="10 0, 0 3.5, 10 7" fill="currentColor" />
              </marker>
            </defs>

            {/* Arches Rendering */}
            {data.levels.map((lvl, lIdx) => {
              const r =
                config.centerRadius +
                config.gapSize +
                lIdx * (config.levelThickness + config.gapSize) +
                config.levelThickness / 2;
              const step = 360 / data.sectors;
              const angularPadding = (config.arcPadding / r) * (180 / Math.PI);
              const isOuterMostLevel = lIdx === data.levels.length - 1;

              return (
                <g key={lvl.id}>
                  {lvl.arcs.map((arc, sIdx) => {
                    const s = sIdx * step + angularPadding / 2;
                    const e = (sIdx + 1) * step - angularPadding / 2;
                    const path = describeTextArc(CENTER, CENTER, r, s, e);
                    const labelPath = describeTextArc(
                      CENTER,
                      CENTER,
                      r + config.levelThickness / 2 + 15,
                      s,
                      e
                    );

                    return (
                      <g
                        key={`${lIdx}-${sIdx}`}
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedArc({
                            levelIndex: lIdx,
                            sectorIndex: sIdx,
                          })
                        }
                      >
                        <path
                          d={path.d}
                          fill="none"
                          stroke={arc.color}
                          strokeWidth={config.levelThickness}
                        />
                        <path id={`p-${lIdx}-${sIdx}`} d={path.d} fill="none" />
                        <text
                          fill={arc.textColor}
                          className="text-[14px] font-bold pointer-events-none"
                        >
                          <textPath
                            href={`#p-${lIdx}-${sIdx}`}
                            startOffset="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {arc.text}
                          </textPath>
                        </text>
                        {isOuterMostLevel && (
                          <>
                            <path
                              id={`ol-${sIdx}`}
                              d={labelPath.d}
                              fill="none"
                            />
                            <text
                              fill="#94a3b8"
                              className="text-[11px] font-bold uppercase pointer-events-none"
                            >
                              <textPath
                                href={`#ol-${sIdx}`}
                                startOffset="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                {data.outermostLabels[sIdx] || ""}
                              </textPath>
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* SIDEWAYS TEXT - FULL HEIGHT FIX */}
            {Array.from({ length: data.sectors }).map((_, sIdx) => {
              const step = 360 / data.sectors;
              // Rotate to the gap between sectors
              const angle = (sIdx + 1) * step;

              const innerBoundary = config.centerRadius;
              const outerBoundary =
                config.centerRadius +
                data.levels.length * (config.levelThickness + config.gapSize);

              const channelHeight = outerBoundary - innerBoundary;
              const width = 30; // The clickable width of the text channel

              return (
                <g
                  key={`ch-${sIdx}`}
                  // We rotate the group so the Y axis of the foreignObject aligns with the gap
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
                        // Move the element so it rotates around the center of the channel
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
                        value={data.channelTexts[`channel-${sIdx}`] || ""}
                        onChange={(e) =>
                          updateChannelText(sIdx, e.target.value)
                        }
                      />
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Center Area */}
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
                  value={data.centerText}
                  onChange={(e) =>
                    setData({ ...data, centerText: e.target.value })
                  }
                />
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>
    </div>
  );
}
