import { useMemo } from "react";
import { useNodes, useViewport } from '@xyflow/react';

const PADDING = 80;
const CORNER_RADIUS = 30;

const regionDefinitions = {
  Edge: { types: ['frontend'], color: 'rgba(15, 15, 15, 0.03)', stroke: 'rgba(15, 15, 15, 0.08)' },
  Compute: { types: ['api', 'worker', 'default'], color: 'rgba(183, 22, 6, 0.03)', stroke: 'rgba(183, 22, 6, 0.1)' },
  Data: { types: ['database', 'cache', 'queue'], color: 'rgba(0, 100, 255, 0.03)', stroke: 'rgba(0, 100, 255, 0.08)' }
};

export default function DynamicRegions() {
  const nodes = useNodes();
  const { x, y, zoom } = useViewport();

  const regions = useMemo(() => {
    const serviceNodes = nodes.filter(n => n.type === 'serviceNode' && !n.hidden);
    
    const calculatedRegions = [];

    Object.entries(regionDefinitions).forEach(([name, def]) => {
      const groupNodes = serviceNodes.filter(n => def.types.includes(n.data.type));
      if (groupNodes.length === 0) return;

      // React Flow node width is typically ~280px, height varies but let's estimate ~160px for the bounding box
      // If node width/height are available in measured, use them, otherwise use estimates
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      groupNodes.forEach(n => {
        const nx = n.position.x;
        const ny = n.position.y;
        const w = n.measured?.width || 280;
        const h = n.measured?.height || 180;
        
        if (nx < minX) minX = nx;
        if (ny < minY) minY = ny;
        if (nx + w > maxX) maxX = nx + w;
        if (ny + h > maxY) maxY = ny + h;
      });

      calculatedRegions.push({
        id: name,
        x: minX - PADDING,
        y: minY - PADDING,
        width: (maxX - minX) + (PADDING * 2),
        height: (maxY - minY) + (PADDING * 2),
        color: def.color,
        stroke: def.stroke,
        label: name
      });
    });

    return calculatedRegions;
  }, [nodes]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" style={{ width: '100%', height: '100%' }}>
      <svg
        className="w-full h-full"
        style={{
          transform: `translate(${x}px, ${y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Subtle abstract architectural lines representing sheets in the far background */}
        <path d="M -2000 -1000 L 4000 -1000 L 4000 3000 L -2000 3000 Z" fill="transparent" />
        
        {regions.map(r => (
          <g key={r.id} className="region-layer transition-all duration-700 ease-in-out">
            {/* The soft region boundary */}
            <rect
              x={r.x}
              y={r.y}
              width={r.width}
              height={r.height}
              rx={CORNER_RADIUS}
              fill={r.color}
              stroke={r.stroke}
              strokeWidth="2"
              strokeDasharray="10 10"
              className="transition-all duration-700 ease-in-out"
            />
            {/* Region Label */}
            <text
              x={r.x + 24}
              y={r.y + 30}
              fill={r.stroke}
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              {r.label} ZONE
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
