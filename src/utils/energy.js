export const ENERGY_TAGS = [
  { id: 'foco_profundo', label: 'Foco Profundo', color: '#6366F1' },
  { id: 'criativo', label: 'Criativo', color: '#EC4899' },
  { id: 'admin', label: 'Administrativo', color: '#64748B' },
  { id: 'conexao', label: 'Conexão', color: '#10B981' },
  { id: 'restaurador', label: 'Restaurador', color: '#34D399' },
  { id: 'social', label: 'Social', color: '#3B82F6' },
  { id: 'reflexivo', label: 'Reflexivo', color: '#8B5CF6' },
  { id: 'fisico', label: 'Físico', color: '#F59E0B' },
  { id: 'estrategico', label: 'Estratégico', color: '#EF4444' },
];

export const ENERGY_TAG_MAP = Object.fromEntries(
  ENERGY_TAGS.map((tag) => [tag.id, tag])
);

export const INDEPENDENT_TEAM_ID = '__independent__';

const defaultAssignmentResolver = (task) => {
  if (!task) return null;
  if (task.assignee_details && typeof task.assignee_details === 'object') {
    return task.assignee_details;
  }

  const rawAssignment = task.assigned_to || task.assignment || task.assignee;

  if (!rawAssignment) return null;

  if (typeof rawAssignment === 'string') {
    try {
      const parsed = JSON.parse(rawAssignment);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  if (typeof rawAssignment === 'object') {
    return {
      name: rawAssignment.name || rawAssignment.full_name || '',
      email: rawAssignment.email || rawAssignment.mail || '',
      teamId: rawAssignment.teamId || rawAssignment.team_id || null,
      teamName: rawAssignment.teamName || rawAssignment.team_name || null,
    };
  }

  return null;
};

export const parseEnergyTags = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch (error) {
        return [];
      }
      return [];
    }

    if (trimmed.includes(',')) {
      return trimmed
        .split(',')
        .map((token) => token.trim())
        .filter(Boolean);
    }

    return [trimmed];
  }

  return [];
};

export const summarizeEnergyByTeam = (
  tasks = [],
  teams = [],
  resolveAssignment = defaultAssignmentResolver
) => {
  const overall = {};
  const teamSummaries = new Map();
  let withoutTag = 0;

  const ensureTeamEntry = (teamId, assignment) => {
    const normalizedTeamId = teamId || INDEPENDENT_TEAM_ID;
    if (!teamSummaries.has(normalizedTeamId)) {
      const teamInfo = teams.find((team) => team.id === teamId);
      const label =
        teamInfo?.name || assignment?.teamName || (teamId ? 'Time sem nome' : 'Independentes');
      teamSummaries.set(normalizedTeamId, {
        teamId: normalizedTeamId,
        originalTeamId: teamId || null,
        label,
        distribution: {},
        total: 0,
        withoutTag: 0,
      });
    }
    return teamSummaries.get(normalizedTeamId);
  };

  let totalTasks = 0;

  tasks.forEach((task) => {
    if (!task) return;
    totalTasks += 1;

    const tags = parseEnergyTags(task.energy_tags || task.energyTags);
    const assignment = resolveAssignment ? resolveAssignment(task) : defaultAssignmentResolver(task);
    const teamId = assignment?.teamId || task.team_id || task.assignee_team_id || null;
    const entry = ensureTeamEntry(teamId, assignment);
    entry.total += 1;

    if (!tags || tags.length === 0) {
      entry.withoutTag += 1;
      withoutTag += 1;
      return;
    }

    tags.forEach((tagId) => {
      if (!tagId) return;
      entry.distribution[tagId] = (entry.distribution[tagId] || 0) + 1;
      overall[tagId] = (overall[tagId] || 0) + 1;
    });
  });

  return {
    totalTasks,
    overall,
    perTeam: Array.from(teamSummaries.values()).sort((a, b) => b.total - a.total),
    withoutTag,
  };
};

export const getEnergyTagMeta = (tagId) => ENERGY_TAG_MAP[tagId] || null;
