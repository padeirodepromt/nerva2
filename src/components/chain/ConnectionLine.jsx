/* canvas: src/components/chain/ConnectionLine.jsx
   desc: Edge Personalizada para ReactFlow. Linha curva com animação de energia.
*/
import React, { memo } from 'react';
import { getBezierPath } from 'reactflow';

const ConnectionLine = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
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
      <path
        id={id}
        style={style}
        className="react-flow__edge-path stroke-muted-foreground/30"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* Partícula de Energia (Só aparece se não for rascunho) */}
      <circle r="2" fill="rgb(var(--accent-rgb))">
        <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
};

export default memo(ConnectionLine);