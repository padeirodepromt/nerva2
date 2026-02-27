import { resolveAssignmentFromTask, INDEPENDENT_TEAM_ID } from './energy';

const COMPLETED_STATUSES = new Set(['completed', 'done', 'concluida', 'concluída', 'concluido', 'concluído', 'finished']);
const BLOCKED_STATUSES = new Set(['blocked', 'on_hold', 'paused']);
const IN_PROGRESS_STATUSES = new Set(['in_progress', 'doing', 'working', 'em_andamento']);

const NO_SANKALPA_KEY = '__no_sankalpa__';

const normalizeStatus = (status) => {
  if (!status || typeof status !== 'string') return 'pending';
  return status.trim().toLowerCase();
};

const computeTaskSummary = (tasks = []) => {
  let completed = 0;
  let blocked = 0;
  let inProgress = 0;
  let pending = 0;

  tasks.forEach((task) => {
    const normalized = normalizeStatus(task?.status);
    if (COMPLETED_STATUSES.has(normalized)) {
      completed += 1;
      return;
    }
    if (BLOCKED_STATUSES.has(normalized)) {
      blocked += 1;
      return;
    }
    if (IN_PROGRESS_STATUSES.has(normalized)) {
      inProgress += 1;
      return;
    }
    pending += 1;
  });

  const total = tasks.length;
  const active = Math.max(0, total - completed);
  const ready = Math.max(0, active - blocked);
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    blocked,
    inProgress,
    pending,
    active,
    ready,
    progress,
  };
};

export function summarizeProgressBySankalpa(tasks = [], projects = [], sankalpas = []) {
  if (!Array.isArray(tasks) || tasks.length === 0) return [];

  const projectMap = new Map(projects.map((project) => [project.id, project]));
  const sankalpaMap = new Map(sankalpas.map((s) => [s.id, s]));

  const groups = new Map();

  const ensureGroup = (key) => {
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        tasks: [],
        projectIds: new Set(),
        colors: new Set(),
        sankalpa: key && key !== NO_SANKALPA_KEY ? sankalpaMap.get(key) : null,
      });
    }
    return groups.get(key);
  };

  tasks.forEach((task) => {
    if (!task) return;
    const project = task.project_id ? projectMap.get(task.project_id) : null;
    const sankalpaId = project?.sankalpa_id || null;
    const groupKey = sankalpaId || NO_SANKALPA_KEY;
    const entry = ensureGroup(groupKey);

    entry.tasks.push(task);
    if (project?.id) {
      entry.projectIds.add(project.id);
      if (project.color) {
        entry.colors.add(project.color);
      }
    }
  });

  return Array.from(groups.values())
    .map((entry) => {
      const summary = computeTaskSummary(entry.tasks);
      if (summary.total === 0) return null;

      const projectCount = entry.projectIds.size;
      const sankalpa = entry.sankalpa;
      const accent = entry.colors.values().next().value || sankalpa?.color || '#f97316';

      let label;
      let description;
      if (sankalpa) {
        label = sankalpa.intention || 'Sankalpa sem nome';
        description = sankalpa.description || `${projectCount} projeto${projectCount === 1 ? '' : 's'} vinculados`;
      } else if (projectCount > 0) {
        label = 'Sem Sankalpa';
        description = `${projectCount} projeto${projectCount === 1 ? '' : 's'} aguardando intenção definida`;
      } else {
        label = 'Trabalho Livre';
        description = 'Tarefas independentes de projeto/sankalpa';
      }

      return {
        id: entry.key,
        sankalpaId: sankalpa?.id || null,
        label,
        description,
        accent,
        projectCount,
        ...summary,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.progress !== a.progress) return b.progress - a.progress;
      return b.total - a.total;
    });
}

export function summarizeProgressByTeam(tasks = [], teams = [], resolveAssignment = resolveAssignmentFromTask) {
  if (!Array.isArray(tasks) || tasks.length === 0) return [];

  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const groups = new Map();

  const ensureTeamEntry = (teamId, assignment) => {
    const key = teamId || INDEPENDENT_TEAM_ID;
    if (!groups.has(key)) {
      const teamInfo = teamId ? teamMap.get(teamId) : null;
      const label = teamInfo?.name || assignment?.teamName || (teamId ? 'Time sem nome' : 'Independentes');
      const accent = teamInfo?.color || '#38bdf8';
      groups.set(key, {
        id: key,
        teamId: teamId || null,
        label,
        accent,
        tasks: [],
        members: new Set(),
      });
    }
    return groups.get(key);
  };

  tasks.forEach((task) => {
    if (!task) return;
    const assignment = resolveAssignment ? resolveAssignment(task) : null;
    const teamId = assignment?.teamId || task.team_id || task.assignee_team_id || null;
    const entry = ensureTeamEntry(teamId, assignment);
    entry.tasks.push(task);

    const memberKey = assignment?.email || assignment?.name || null;
    if (memberKey) {
      entry.members.add(memberKey);
    }
  });

  return Array.from(groups.values())
    .map((entry) => {
      const summary = computeTaskSummary(entry.tasks);
      if (summary.total === 0) return null;
      return {
        id: entry.id,
        teamId: entry.teamId,
        label: entry.label,
        accent: entry.accent,
        memberCount: entry.members.size,
        ...summary,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.progress !== a.progress) return b.progress - a.progress;
      return b.total - a.total;
    });
}
