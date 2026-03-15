"use client";

import { useState, useMemo } from "react";
import { TaskItem, TaskStatus, TaskPriority, TaskType } from "@/types/tasks";
import { filterTasks, sortTasks, getTaskStats } from "@/lib/tasks/utils";
import { useAppState } from "@/hooks/use-app-state";
import { selectUnifiedTasks } from "@/lib/store/app-selectors";
import { TasksHeader } from "@/components/tasks/tasks-header";
import { TasksStats } from "@/components/tasks/tasks-stats";
import { TasksFilters } from "@/components/tasks/tasks-filters";
import { TasksTable } from "@/components/tasks/tasks-table";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TasksEmptyState } from "@/components/tasks/tasks-empty-state";
import { Spinner } from "@/components/ui/spinner";

import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

export default function TasksPage() {
  const { state, isLoaded, updateState } = useAppState();
  const tasks = useMemo(() => selectUnifiedTasks(state), [state]);

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "overdue" | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TaskType | "all">("all");
  const [sortBy, setSortBy] = useState<"nearest-date" | "priority" | "newest" | "oldest">("nearest-date");

  // Derived data
  const stats = useMemo(() => getTaskStats(tasks), [tasks]);
  
  const displayedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, statusFilter, priorityFilter, typeFilter);
    return sortTasks(filtered, sortBy);
  }, [tasks, statusFilter, priorityFilter, typeFilter, sortBy]);

  // Handlers
  const handleAddClick = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const handleEditClick = (task: TaskItem) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setTaskToDelete(id);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      updateState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskToDelete)
      }));
      setTaskToDelete(null);
    }
  };

  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    updateState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t =>
          t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
        )
    }));
  };

  const handleSaveTask = (task: TaskItem) => {
    updateState(prev => {
      const idx = prev.tasks.findIndex(t => t.id === task.id);
      let updatedTasks = [];
      if (idx >= 0) {
        updatedTasks = [...prev.tasks];
        updatedTasks[idx] = task;
      } else {
        updatedTasks = [task, ...prev.tasks];
      }
      return { ...prev, tasks: updatedTasks };
    });
  };

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-in fade-in zoom-in-95 duration-500">

      <TasksHeader onAddTask={handleAddClick} />

      {tasks.length > 0 && (
        <TasksStats stats={stats} />
      )}

      <section className="space-y-5">
        {tasks.length > 0 && (
          <TasksFilters
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
            typeFilter={typeFilter} setTypeFilter={setTypeFilter}
            sortBy={sortBy} setSortBy={setSortBy}
          />
        )}

        {tasks.length === 0 ? (
          <TasksEmptyState onAddTask={handleAddClick} />
        ) : displayedTasks.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-2xl border-border/60 text-muted-foreground bg-muted/20">
            <p>No tasks match your current filters.</p>
            <button
              onClick={() => { setStatusFilter("all"); setPriorityFilter("all"); setTypeFilter("all"); }}
              className="mt-2 text-primary font-medium hover:underline text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <TasksTable 
            tasks={displayedTasks}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </section>

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSaveTask}
        initialData={editingTask}
      />

      <ConfirmActionDialog
        isOpen={!!taskToDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />

    </div>
  );
}
