export function Markers() {
  return (
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
  );
}

