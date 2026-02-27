/* src/components/mindmap/MindMapEdge.jsx
   desc: Conexões de Energia (Glow Edge).
*/
import React from 'react';
import { getBezierPath } from 'reactflow';

export default function MindMapEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* Camada 1: Glow (Fundo largo e transparente) */}
      <path
        id={`${id}-glow`}
        style={{ ...style, strokeWidth: 3, stroke: 'rgba(255,255,255,0.05)', fill: 'none' }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      
      {/* Camada 2: Fio Principal (Fino e definido) */}
      <path
        id={id}
        style={{ ...style, strokeWidth: 1.5, stroke: 'rgba(255,255,255,0.2)', fill: 'none' }}
        className="react-flow__edge-path transition-all duration-500 hover:stroke-white/50"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
}