import { resolveAssignmentFromTask } from '@/utils/energy';

const NODE_COLORS = {
  idea: { border: '#818CF8', bg: 'rgba(129, 140, 248, 0.15)' },
  task: { border: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)' },
  project: { border: '#4ADE80', bg: 'rgba(74, 222, 128, 0.15)' },
  default: { border: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.15)' },
};

const normalizePosition = (position) => {
  if (!position) return null;
  if (typeof position === 'string') {
    try {
      const parsed = JSON.parse(position);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (error) {
      return null;
    }
    return null;
  }
  if (typeof position === 'object') {
    return position;
  }
  return null;
};

const normalizeAssignment = (raw) => {
  if (!raw) return null;
  if (typeof raw === 'object') {
    const assignment = {
      name: raw.name || raw.assignee_name || '',
      email: raw.email || raw.assignee_email || '',
      teamId: raw.teamId || raw.team_id || null,
      teamName: raw.teamName || raw.team_name || '',
    };
    return assignment.name || assignment.email || assignment.teamId ? assignment : null;
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return normalizeAssignment(parsed);
    } catch (_error) {
      if (raw.trim().length === 0) return null;
      return { name: raw, email: '', teamId: null, teamName: '' };
    }
  }
  return null;
};

const buildBaseNode = (rawNode) => {
  if (!rawNode) return null;

  const nodeType = rawNode.node_type || rawNode.type || (rawNode.reference_type ?? 'default');
  const label = rawNode.label || rawNode.title || rawNode.name || 'Sem título';
  const id = rawNode.id || rawNode.nodeId || rawNode.reference_id || rawNode.task_id;
  if (!id) return null;

  const position = normalizePosition(rawNode.position) || { x: Math.random() * 400, y: Math.random() * 400 };
  const color = NODE_COLORS[nodeType] || NODE_COLORS.default;
  const assignment = normalizeAssignment(rawNode.assignee_details || rawNode.assignment || rawNode.assigned_to);

  const status = (rawNode.status || rawNode.task_status || '').toLowerCase();
  const dueDate = rawNode.due_date || rawNode.task_due_date || null;
  const priority = rawNode.priority || rawNode.task_priority || null;

  return {
    id,
    type: 'customNode',
    position,
    data: {
      label,
      node_type: nodeType,
      reference_id: rawNode.reference_id || (nodeType === 'task' ? rawNode.id || rawNode.task_id : null),
      color,
      status,
      priority,
      due_date: dueDate,
      assignment,
      assignee_team_id: assignment?.teamId || rawNode.team_id || rawNode.assignee_team_id || null,
      team_name: assignment?.teamName || rawNode.team_name || '',
      sankalpa_id: rawNode.sankalpa_id || rawNode.project_sankalpa_id || null,
    },
  };
};

const buildEdge = (rawEdge) => {
  if (!rawEdge) return null;
  const source = rawEdge.sourceTaskId || rawEdge.source || rawEdge.source_node_id;
  const target = rawEdge.targetTaskId || rawEdge.target || rawEdge.target_node_id;
  if (!source || !target) return null;

  const connectionType = rawEdge.connectionType || rawEdge.type || 'related';
  const isDependency = connectionType === 'dependency';

  return {
    id: rawEdge.id || `edge-${source}-${target}-${connectionType}`,
    source,
    target,
    type: 'smoothstep',
    animated: isDependency,
    label: isDependency ? 'Depende' : 'Relacionado',
    data: { connectionType },
    style: {
      stroke: isDependency ? 'var(--color-destructive)' : 'var(--color-accent)',
      strokeWidth: 2,
    },
  };
};

const matchesAssignmentFilters = (nodeData, filters = {}, highlightTaskId) => {
  const nodeType = nodeData.node_type;
  if (nodeType !== 'task') {
    return true;
  }

  const assignment = nodeData.assignment || resolveAssignmentFromTask(nodeData);
  const memberKey = assignment?.email || assignment?.name || null;
  const teamId = assignment?.teamId || nodeData.assignee_team_id || null;

  const { teamId: teamFilter = 'all', memberId = 'all', unassignedOnly = false } = filters;

  if (highlightTaskId && (nodeData.reference_id === highlightTaskId || nodeData.id === highlightTaskId)) {
    return true;
  }

  if (unassignedOnly && assignment) {
    return false;
  }
  if (unassignedOnly && !assignment) {
    return true;
  }

  if (teamFilter !== 'all') {
    if (teamFilter === 'independent') {
      if (teamId) return false;
    } else if (teamId !== teamFilter) {
      return false;
    }
  }

  if (memberId !== 'all') {
    if (!memberKey || memberKey !== memberId) {
      return false;
    }
  }

  return true;
};

export function buildMindMapGraph(rawGraph = {}, { filters = {}, highlightTaskId = null } = {}) {
  const rawNodes = Array.isArray(rawGraph.nodes) ? rawGraph.nodes : [];
  const rawEdges = Array.isArray(rawGraph.edges) ? rawGraph.edges : [];

  const baseNodes = rawNodes
    .map((node) => buildBaseNode(node))
    .filter(Boolean);

  const edges = rawEdges
    .map((edge) => buildEdge(edge))
    .filter(Boolean);

  const counts = new Map();
  edges.forEach((edge) => {
    const sourceEntry = counts.get(edge.source) || { incoming: 0, outgoing: 0, dependencyIncoming: 0, dependencyOutgoing: 0 };
    sourceEntry.outgoing += 1;
    if (edge.data?.connectionType === 'dependency') {
      sourceEntry.dependencyOutgoing += 1;
    }
    counts.set(edge.source, sourceEntry);

    const targetEntry = counts.get(edge.target) || { incoming: 0, outgoing: 0, dependencyIncoming: 0, dependencyOutgoing: 0 };
    targetEntry.incoming += 1;
    if (edge.data?.connectionType === 'dependency') {
      targetEntry.dependencyIncoming += 1;
    }
    counts.set(edge.target, targetEntry);
  });

  const teamMap = new Map();
  const memberMap = new Map();
  let totalTaskNodes = 0;
  let visibleTaskNodes = 0;
  let hasUnassigned = false;

  const decoratedNodes = baseNodes.map((node) => {
    const nodeData = node.data || {};
    const assignment = nodeData.assignment;
    const teamId = assignment?.teamId || nodeData.assignee_team_id || null;
    const teamName = assignment?.teamName || nodeData.team_name || '';
    const memberKey = assignment?.email || assignment?.name || null;

    if (nodeData.node_type === 'task') {
      totalTaskNodes += 1;
      if (!assignment) {
        hasUnassigned = true;
      }

      if (teamId && !teamMap.has(teamId)) {
        teamMap.set(teamId, {
          value: teamId,
          label: teamName || 'Time sem nome',
        });
      }
      if (!teamId && !teamMap.has('__independent__')) {
        teamMap.set('__independent__', {
          value: null,
          label: 'Independentes',
        });
      }

      if (memberKey && !memberMap.has(memberKey)) {
        memberMap.set(memberKey, {
          value: memberKey,
          label: assignment?.name || assignment?.email || 'Responsável',
          teamId: teamId || null,
        });
      }
    }

    const matchesFilters = matchesAssignmentFilters(nodeData, filters, highlightTaskId);
    if (nodeData.node_type === 'task' && matchesFilters) {
      visibleTaskNodes += 1;
    }

    const edgeCounts = counts.get(node.id) || { incoming: 0, outgoing: 0, dependencyIncoming: 0 };
    const highlighted = Boolean(
      highlightTaskId && (nodeData.reference_id === highlightTaskId || node.id === highlightTaskId),
    );

    return {
      ...node,
      data: {
        ...node.data,
        incoming: edgeCounts.incoming,
        outgoing: edgeCounts.outgoing,
        blocked: edgeCounts.dependencyIncoming > 0,
        dimmed: nodeData.node_type === 'task' ? !matchesFilters : false,
        highlighted,
      },
    };
  });

  const teamOptions = Array.from(teamMap.values())
    .filter(Boolean)
    .map((option) => ({
      ...option,
      value: option.value === '__independent__' ? null : option.value,
    }))
    .sort((a, b) => (a.label || '').localeCompare(b.label || ''));

  const memberOptions = Array.from(memberMap.values())
    .filter(Boolean)
    .sort((a, b) => (a.label || '').localeCompare(b.label || ''));

  return {
    nodes: decoratedNodes,
    edges,
    meta: {
      teamOptions,
      memberOptions,
      totalTaskNodes,
      visibleTaskNodes,
      hasUnassigned,
    },
  };
}

export const mergeNodePositions = (previousNodes = [], nextNodes = []) => {
  const previousMap = new Map(previousNodes.map((node) => [node.id, node]));
  return nextNodes.map((node) => {
    const existing = previousMap.get(node.id);
    if (!existing) return node;
    const mergedPosition = existing.position || node.position;
    return {
      ...node,
      position: mergedPosition,
      positionAbsolute: existing.positionAbsolute || node.positionAbsolute,
    };
  });
};
