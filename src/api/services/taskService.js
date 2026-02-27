/**
 * src/api/services/taskService.js
 * Task Service - Basic implementation for agent task operations
 * Provides: task checks, plan validation, task tracking
 */

/**
 * Verifies if a specific agent is enabled for a given plan
 */
export async function isAgentEnabledForPlan(agentId, planKey) {
  try {
    // TODO: Implement actual plan verification against database
    // This is a placeholder that allows all agents
    console.log(`[Task Service] Checking if agent ${agentId} is enabled for plan ${planKey}`);
    return true; // Default: allow
  } catch (error) {
    console.error('[Task Service] Error checking agent enablement:', error);
    return false;
  }
}

/**
 * Gets all tasks for a project
 */
export async function getProjectTasks(projectId) {
  try {
    console.log(`[Task Service] Fetching tasks for project ${projectId}`);
    // TODO: Query database for project tasks
    return [];
  } catch (error) {
    console.error('[Task Service] Error fetching tasks:', error);
    return [];
  }
}

/**
 * Creates a new task
 */
export async function createTask(projectId, taskData) {
  try {
    console.log(`[Task Service] Creating task in project ${projectId}:`, taskData);
    // TODO: Save to database
    return { id: `task-${Date.now()}`, ...taskData };
  } catch (error) {
    console.error('[Task Service] Error creating task:', error);
    throw error;
  }
}

/**
 * Updates an existing task
 */
export async function updateTask(taskId, updates) {
  try {
    console.log(`[Task Service] Updating task ${taskId}:`, updates);
    // TODO: Update in database
    return { id: taskId, ...updates };
  } catch (error) {
    console.error('[Task Service] Error updating task:', error);
    throw error;
  }
}

/**
 * Assigns a task to an agent
 */
export async function assignTaskToAgent(taskId, agentId, userId) {
  try {
    console.log(`[Task Service] Assigning task ${taskId} to agent ${agentId}`);
    // TODO: Create assignment in database
    return { taskId, agentId, assignedAt: new Date() };
  } catch (error) {
    console.error('[Task Service] Error assigning task:', error);
    throw error;
  }
}

export const taskService = {
  isAgentEnabledForPlan,
  getProjectTasks,
  createTask,
  updateTask,
  assignTaskToAgent,
};
