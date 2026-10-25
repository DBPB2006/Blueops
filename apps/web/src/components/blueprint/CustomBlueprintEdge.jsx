import { getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';

export default function CustomBlueprintEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.5,
  });

  return (
    <>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-enerblock-red)" />
        </marker>
        <marker id="arrow-selected" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-enerblock-dark)" />
        </marker>
      </defs>

      {/* Invisible thicker path for easier clicking */}
      <BaseEdge
        path={edgePath}
        style={{ strokeWidth: 20, stroke: 'transparent', cursor: 'pointer' }}
      />
      
      {/* Visible Path */}
      <BaseEdge
        path={edgePath}
        style={{
          strokeWidth: selected ? 3 : 2,
          stroke: selected ? 'var(--color-enerblock-dark)' : 'var(--color-enerblock-red)',
        }}
        markerEnd={selected ? "url(#arrow-selected)" : "url(#arrow)"}
        className={selected ? "" : "opacity-80 hover:opacity-100 transition-opacity"}
      />
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div className={`text-[9px] uppercase tracking-widest font-bold mono px-2 py-0.5 rounded-full text-center border shadow-sm transition-colors cursor-pointer
            ${selected ? 'bg-enerblock-dark text-white border-enerblock-dark' : 'bg-white text-enerblock-red border-enerblock-red hover:bg-enerblock-red hover:text-white'}`}>
            {data?.type || 'Depends On'}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
