import { useCallback, RefObject } from "react";
import { SVG_SIZE, CENTER } from "@/types/diagram";

export function useDownloadPNG(svgRef: RefObject<SVGSVGElement | null>) {
  const downloadPNG = useCallback(() => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

    const originalForeignObjects = Array.from(
      svgElement.querySelectorAll("foreignObject")
    );
    const clonedForeignObjects = Array.from(
      svgClone.querySelectorAll("foreignObject")
    );

    originalForeignObjects.forEach((originalFO, index) => {
      const clonedFO = clonedForeignObjects[index];
      if (!clonedFO) return;

      const parent = clonedFO.parentElement;
      if (!parent) return;

      const input = originalFO.querySelector("input") as HTMLInputElement;
      const textarea = originalFO.querySelector(
        "textarea"
      ) as HTMLTextAreaElement;
      const textElement = input || textarea;

      if (!textElement) {
        parent.removeChild(clonedFO);
        return;
      }

      const text = textElement.value || "";
      if (!text) {
        parent.removeChild(clonedFO);
        return;
      }

      const computedStyle = window.getComputedStyle(textElement);
      const color = computedStyle.color || textElement.style.color || "#000000";
      const fontSize = computedStyle.fontSize || "14px";
      const fontWeight = computedStyle.fontWeight || "normal";

      const x = parseFloat(clonedFO.getAttribute("x") || "0");
      const y = parseFloat(clonedFO.getAttribute("y") || "0");
      const width = parseFloat(clonedFO.getAttribute("width") || "0");
      const height = parseFloat(clonedFO.getAttribute("height") || "0");

      const parentTransform = parent.getAttribute("transform") || "";
      const divElement = originalFO.querySelector("div");
      const divComputedStyle = divElement
        ? window.getComputedStyle(divElement)
        : null;
      const divTransform =
        divComputedStyle?.transform || divElement?.style.transform || "";

      let finalTransform = "";
      let textX = x + width / 2;
      let textY = y + height / 2;

      if (parentTransform.includes("rotate")) {
        const rotateMatch = parentTransform.match(
          /rotate\(([^,]+),?\s*([^,]+)?,?\s*([^)]+)?\)/
        );
        if (rotateMatch) {
          const angle = parseFloat(rotateMatch[1]) || 0;
          const centerX = rotateMatch[2] ? parseFloat(rotateMatch[2]) : CENTER;
          const centerY = rotateMatch[3] ? parseFloat(rotateMatch[3]) : CENTER;

          if (
            divTransform.includes("rotate(90deg)") ||
            divTransform.includes("matrix")
          ) {
            const additionalAngle = angle + 90;
            finalTransform = `rotate(${additionalAngle}, ${centerX}, ${centerY})`;
          } else {
            finalTransform = `rotate(${angle}, ${centerX}, ${centerY})`;
          }
        }
      } else if (
        divTransform.includes("rotate(90deg)") ||
        divTransform.includes("matrix")
      ) {
        textX = x + width / 2;
        textY = y + height / 2;
        finalTransform = `rotate(90, ${textX}, ${textY})`;
      }

      const textEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      textEl.setAttribute("x", textX.toString());
      textEl.setAttribute("y", textY.toString());
      textEl.setAttribute("fill", color);
      textEl.setAttribute("font-size", fontSize);
      textEl.setAttribute("font-weight", fontWeight);
      textEl.setAttribute("text-anchor", "middle");
      textEl.setAttribute("dominant-baseline", "middle");
      if (finalTransform) {
        textEl.setAttribute("transform", finalTransform);
      }
      textEl.textContent = text;

      parent.insertBefore(textEl, clonedFO);
      parent.removeChild(clonedFO);
    });

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgClone);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = SVG_SIZE;
      canvas.height = SVG_SIZE;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "transparent";
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
