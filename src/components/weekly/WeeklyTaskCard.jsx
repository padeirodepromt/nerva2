
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Task } from "@/api/entities";
import { Clock, Flag, CheckCircle, Circle, Calendar, Edit2, Trash2 } from "@/components/icons/PranaLandscapeIcons";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const priorityColors = {
  low: "#3B82F6",
  medium: "#F59E0B",
  high: "#EF4444",
  critical: "#8B5CF6"
};

const statusIcons = {
  todo: Circle,
  in_progress: Clock,
  completed: CheckCircle,
  blocked: Flag
};

export default function WeeklyTaskCard({ task, projects, onUpdate }) {
  const project = projects.find(p => p.id === task.project_id);
  const StatusIcon = statusIcons[task.status];

  const toggleStatus = async () => {
    const statusCycle = {
      'todo': 'in_progress',
      'in_progress': 'completed',
      'completed': 'todo',
      'blocked': 'todo'
    };
    const newStatus = statusCycle[task.status];
    await Task.update(task.id, { status: newStatus });
    onUpdate();
  };

  const deleteTask = async () => {
    // Soft delete
    await Task.update(task.id, { deleted_at: new Date().toISOString() });
    onUpdate();
  };

  const updatePriority = async (priority) => {
    await Task.update(task.id, { priority });
    onUpdate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ zIndex: 10 }}
      className="glass-effect px-2 py-1.5 rounded-md cursor-pointer group relative text-[11px] leading-tight"
    >
      <div className="flex items-start gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleStatus}
          className="p-0 h-auto hover:bg-transparent mt-0.5"
        >
          <StatusIcon
            className={`w-3.5 h-3.5 transition-colors ${
              task.status === 'completed' ? 'text-green-500' :
              task.status === 'in_progress' ? 'text-blue-500' : 'opacity-60'
            }`}
          />
        </Button>

        <div className="flex-1 min-w-0">
          <h4 className={`font-medium truncate ${
            task.status === 'completed' ? 'line-through opacity-60' : ''
          }`}>
            {task.title}
          </h4>

          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
            {project && (
              <Badge variant="outline" className="text-[10px] px-1 py-0.5 leading-none">
                <div
                  className="w-1.5 h-1.5 rounded-full mr-1"
                  style={{ backgroundColor: project.color }}
                />
                <span className="truncate">{project.name}</span>
              </Badge>
            )}
             {task.planner_slot?.time && (
              <Badge variant="outline" className="text-[10px] px-1 py-0.5 leading-none opacity-80">
                {task.planner_slot.time}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
