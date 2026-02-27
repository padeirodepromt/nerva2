/**
 * HifasConnections.jsx
 * 
 * Renderiza as conexões entre tarefas (hifas) como linhas SVG
 * com pulsos de energia que refletem o progresso de cada subtarefa.
 * Integra-se ao MindMap para mostrar fluxo de energia entre nós.
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Calcula um caminho SVG bezier que conecta dois pontos
 * mantendo espaço visual e permitindo visualizar hierarquias
 */
const calculateConnectionPath = (from, to, curvature = 0.3) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cpx = from.x + dx * curvature;
  const cpy = from.y + dy * (1 - curvature);
  
  return `M${from.x},${from.y} C${cpx},${cpy} ${to.x - dx * curvature},${to.y - dy * (1 - curvature)} ${to.x},${to.y}`;
};

/**
 * Calcula cores baseadas em progresso
 */
const getConnectionColor = (progress, biomeTheme) => {
  const colorMap = {
    nascente: {
      inactive: '#0ea5e9',
      active: '#06b6d4',
      complete: '#10b981'
    },
    floresta: {
      inactive: '#16a34a',
      active: '#22c55e',
      complete: '#fbbf24'
    },
    sertao: {
      inactive: '#dc2626',
      active: '#f97316',
      complete: '#fcd34d'
    },
    ventos: {
      inactive: '#3b82f6',
      active: '#0284c7',
      complete: '#10b981'
    },
    cosmos: {
      inactive: '#a855f7',
      active: '#d946ef',
      complete: '#f0abfc'
    }
  };

  const theme = colorMap[biomeTheme] || colorMap.floresta;

  if (progress >= 100) return theme.complete;
  if (progress >= 50) return theme.active;
  return theme.inactive;
};

/**
 * Componente individual de conexão com pulso de energia
 */
const HifaConnection = ({
  id,
  from,
  to,
  progress = 0,
  biome = 'floresta',
  parentProgress = 0,
  energyFlow = true
}) => {
  const pathD = calculateConnectionPath(from, to, 0.25);
  const color = getConnectionColor(progress, biome);
  const parentColor = getConnectionColor(parentProgress, biome);

  return (
    <g key={id}>
      {/* Linha de fundo (menor opacidade) */}
      <path
        d={pathD}
        stroke={parentColor}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />

      {/* Linha principal com progresso */}
      <motion.path
        d={pathD}
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity={Math.max(0.5, progress / 100)}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.min(progress / 100, 1) }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />

      {/* Pulso de energia quando ativa */}
      {energyFlow && progress > 0 && progress < 100 && (
        <motion.circle
          r="3"
          fill={color}
          opacity="0.8"
          animate={{
            offsetDistance: ['0%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <animateMotion dur="2s" repeatCount="indefinite">
            <mpath href={`#path-${id}`} />
          </animateMotion>
        </motion.circle>
      )}

      {/* Brilho ao concluir */}
      {progress >= 100 && (
        <motion.path
          d={pathD}
          stroke={color}
          strokeWidth="3"
          fill="none"
          opacity="0"
          animate={{ opacity: [0.8, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </g>
  );
};

/**
 * Sistema completo de conexões entre tarefas
 * Renderiza todas as hifas com animações em cascata
 */
export const HifasConnections = ({
  connections = [],
  biome = 'floresta',
  animationDelay = 0.1,
  interactive = false
}) => {
  const [hoveredConnection, setHoveredConnection] = useState(null);

  // Filtra apenas conexões válidas
  const validConnections = connections.filter(conn => 
    conn.from && conn.to && conn.from.x !== undefined && conn.to.x !== undefined
  );

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        {/* Define IDs para as linhas (usadas em animateMotion) */}
        {validConnections.map((conn, idx) => (
          <path
            key={`path-def-${conn.id || idx}`}
            id={`path-${conn.id || idx}`}
            d={calculateConnectionPath(conn.from, conn.to)}
            fill="none"
          />
        ))}
      </defs>

      {/* Renderiza todas as conexões */}
      {validConnections.map((connection, idx) => (
        <motion.g
          key={connection.id || `connection-${idx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: idx * animationDelay,
            duration: 0.5
          }}
          onMouseEnter={() => interactive && setHoveredConnection(connection.id)}
          onMouseLeave={() => setHoveredConnection(null)}
          className={interactive ? 'cursor-pointer' : ''}
        >
          <HifaConnection
            id={connection.id || idx}
            from={connection.from}
            to={connection.to}
            progress={connection.progress || 0}
            biome={biome}
            parentProgress={connection.parentProgress || 0}
            energyFlow={connection.energyFlow !== false}
          />

          {/* Tooltip ao hover (opcional) */}
          {interactive && hoveredConnection === connection.id && connection.label && (
            <text
              x={(connection.from.x + connection.to.x) / 2}
              y={(connection.from.y + connection.to.y) / 2 - 10}
              textAnchor="middle"
              className="text-xs fill-gray-700 bg-white px-2 py-1 rounded"
              style={{ pointerEvents: 'none' }}
            >
              {connection.label}: {connection.progress}%
            </text>
          )}
        </motion.g>
      ))}
    </svg>
  );
};

/**
 * Utilidade para converter uma árvore de tarefas em conexões
 * Transforma hierarquia de projeto em array de conexões
 */
export const projectToConnections = (project, positions = {}) => {
  const connections = [];
  
  const traverse = (node, parentPos = { x: 100, y: 100 }, depth = 0) => {
    if (!node || !parentPos) return;

    // Calcula posição do nó baseada na profundidade
    const nodePos = positions[node.id] || {
      x: parentPos.x + depth * 150,
      y: parentPos.y + Math.random() * 100
    };

    // Se tem parent, cria conexão
    if (parentPos !== nodePos) {
      connections.push({
        id: `hifa-${node.parent_id}-to-${node.id}`,
        from: parentPos,
        to: nodePos,
        progress: node.progress || 0,
        parentProgress: node.parent_progress || 0,
        label: node.title,
        energyFlow: true
      });
    }

    // Processa filhos
    if (node.subtasks && Array.isArray(node.subtasks)) {
      node.subtasks.forEach((child, idx) => {
        traverse(
          child,
          nodePos,
          depth + 1
        );
      });
    }
  };

  traverse(project);
  return connections;
};

/**
 * Hook customizado para gerenciar animações de hifas
 */
export const useHifasAnimation = (connections, options = {}) => {
  const [animatedConnections, setAnimatedConnections] = useState(connections);

  useEffect(() => {
    // Simula progresso incremental
    if (options.autoProgression) {
      const interval = setInterval(() => {
        setAnimatedConnections(prev =>
          prev.map(conn => ({
            ...conn,
            progress: Math.min(100, (conn.progress || 0) + (options.progressStep || 5))
          }))
        );
      }, options.interval || 1000);

      return () => clearInterval(interval);
    }
  }, [options]);

  return animatedConnections;
};

export default HifasConnections;
