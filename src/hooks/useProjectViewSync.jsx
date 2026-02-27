import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const defaultFilters = Object.freeze({
  teamId: 'all',
  memberId: 'all',
  unassignedOnly: false,
});

const defaultInsightBundle = Object.freeze({
  insights: [],
  highlightTaskId: null,
  recommendedTeam: null,
  source: null,
  updatedAt: 0,
});

const defaultProjectState = Object.freeze({
  filters: defaultFilters,
  filtersUpdatedAt: 0,
  insightBundle: defaultInsightBundle,
});

const ProjectViewSyncContext = createContext(null);

const shallowEqual = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (a[key] !== b[key]) return false;
  }
  return true;
};

const areInsightsEqual = (a, b) => {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    const entryA = a[i];
    const entryB = b[i];
    if (entryA === entryB) continue;
    const serializedA = JSON.stringify(entryA);
    const serializedB = JSON.stringify(entryB);
    if (serializedA !== serializedB) return false;
  }
  return true;
};

export function ProjectViewSyncProvider({ children }) {
  const [state, setState] = useState(() => new Map());

  const getProjectState = useCallback((projectId) => {
    if (!projectId) return defaultProjectState;
    return state.get(projectId) || defaultProjectState;
  }, [state]);

  const setFilters = useCallback((projectId, partialFilters = {}, options = {}) => {
    if (!projectId) return;
    const { replace = false } = options;
    setState((prev) => {
      const next = new Map(prev);
      const previousState = prev.get(projectId) || defaultProjectState;
      const baseFilters = replace ? defaultFilters : previousState.filters;
      const nextFilters = { ...baseFilters, ...partialFilters };

      if (shallowEqual(previousState.filters, nextFilters)) {
        return prev;
      }

      const updatedState = {
        ...previousState,
        filters: nextFilters,
        filtersUpdatedAt: Date.now(),
      };
      next.set(projectId, updatedState);
      return next;
    });
  }, []);

  const setInsightBundle = useCallback((projectId, bundle = {}, options = {}) => {
    if (!projectId) return;
    const { preserveHighlight = false, mergeInsights = false } = options;
    setState((prev) => {
      const next = new Map(prev);
      const previousState = prev.get(projectId) || defaultProjectState;
      const previousBundle = previousState.insightBundle || defaultInsightBundle;

      let nextBundle = mergeInsights
        ? { ...previousBundle }
        : { ...defaultInsightBundle };

      if (bundle.insights) {
        nextBundle.insights = Array.isArray(bundle.insights)
          ? bundle.insights.slice()
          : previousBundle.insights;
      } else if (mergeInsights) {
        nextBundle.insights = previousBundle.insights;
      }

      if ('recommendedTeam' in bundle) {
        nextBundle.recommendedTeam = bundle.recommendedTeam;
      } else if (mergeInsights) {
        nextBundle.recommendedTeam = previousBundle.recommendedTeam;
      }

      if ('source' in bundle) {
        nextBundle.source = bundle.source;
      } else if (mergeInsights) {
        nextBundle.source = previousBundle.source;
      }

      if ('highlightTaskId' in bundle) {
        if (!(preserveHighlight && previousBundle.highlightTaskId)) {
          nextBundle.highlightTaskId = bundle.highlightTaskId;
        } else if (!previousBundle.highlightTaskId) {
          nextBundle.highlightTaskId = bundle.highlightTaskId;
        } else {
          nextBundle.highlightTaskId = previousBundle.highlightTaskId;
        }
      } else if (mergeInsights) {
        nextBundle.highlightTaskId = previousBundle.highlightTaskId;
      }

      const insightsEqual = areInsightsEqual(previousBundle.insights, nextBundle.insights);
      const highlightEqual = previousBundle.highlightTaskId === nextBundle.highlightTaskId;
      const recommendationEqual = JSON.stringify(previousBundle.recommendedTeam) === JSON.stringify(nextBundle.recommendedTeam);
      const sourceEqual = previousBundle.source === nextBundle.source;

      if (insightsEqual && highlightEqual && recommendationEqual && sourceEqual) {
        return prev;
      }

      nextBundle.updatedAt = Date.now();
      const updatedState = {
        ...previousState,
        insightBundle: nextBundle,
      };
      next.set(projectId, updatedState);
      return next;
    });
  }, []);

  const clearProjectState = useCallback((projectId) => {
    if (!projectId) return;
    setState((prev) => {
      if (!prev.has(projectId)) return prev;
      const next = new Map(prev);
      next.delete(projectId);
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    getProjectState,
    setFilters,
    setInsightBundle,
    clearProjectState,
  }), [getProjectState, setFilters, setInsightBundle, clearProjectState]);

  return (
    <ProjectViewSyncContext.Provider value={value}>
      {children}
    </ProjectViewSyncContext.Provider>
  );
}

export function useProjectViewSync(projectId) {
  const context = useContext(ProjectViewSyncContext);
  if (!context) {
    throw new Error('useProjectViewSync deve ser usado dentro de um ProjectViewSyncProvider');
  }

  const projectState = context.getProjectState(projectId);
  const filters = projectState.filters || defaultFilters;
  const insightBundle = projectState.insightBundle || defaultInsightBundle;

  const setFilters = useCallback((partialFilters, options) => {
    if (!projectId) return;
    context.setFilters(projectId, partialFilters, options);
  }, [context, projectId]);

  const setInsightBundle = useCallback((bundle, options) => {
    if (!projectId) return;
    context.setInsightBundle(projectId, bundle, options);
  }, [context, projectId]);

  const clearState = useCallback(() => {
    if (!projectId) return;
    context.clearProjectState(projectId);
  }, [context, projectId]);

  return {
    projectId,
    filters,
    insightBundle,
    setFilters,
    setInsightBundle,
    clearState,
  };
}

