import { useCallback, RefObject } from "react";
import { SVG_SIZE } from "@/types/diagram";

export function useDownloadPNG(svgRef: RefObject<SVGSVGElement | null>) {
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
  }, [svgRef]);

  return downloadPNG;
}

