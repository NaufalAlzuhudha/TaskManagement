"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { TaskFilters } from "@/components/task-filters";
import { TaskTable } from "@/components/task-table";
import { TaskFormDialog } from "@/components/task-form-dialog";
import { Button } from "@/components/ui/button";
import { getTasks } from "@/actions/tasks";
import { Task, TaskFilterParams } from "@/types";

interface TasksViewProps {
  initialTasks: Task[];
  initialFilters?: TaskFilterParams;
}

export function TasksView({
  initialTasks,
  initialFilters = {},
}: TasksViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filters, setFilters] = useState<TaskFilterParams>({
    search: initialFilters.search || "",
    status: initialFilters.status || "ALL",
    priority: initialFilters.priority || "ALL",
    dueDateFilter: initialFilters.dueDateFilter || "ALL",
    sortBy: initialFilters.sortBy || "createdAt",
    sortOrder: initialFilters.sortOrder || "desc",
  });
  const [isPending, startTransition] = useTransition();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const fetchFilteredTasks = useCallback(
    (currentFilters: TaskFilterParams) => {
      startTransition(async () => {
        const res = await getTasks(currentFilters);
        if (res.success && res.data) {
          setTasks(res.data);
        }
      });
    },
    []
  );

  const handleFilterChange = (newFilters: TaskFilterParams) => {
    setFilters(newFilters);
    fetchFilteredTasks(newFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters: TaskFilterParams = {
      search: "",
      status: "ALL",
      priority: "ALL",
      dueDateFilter: "ALL",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(defaultFilters);
    fetchFilteredTasks(defaultFilters);
  };

  // Re-fetch on mount if filters are already set
  useEffect(() => {
    if (
      initialFilters.dueDateFilter ||
      initialFilters.status ||
      initialFilters.priority
    ) {
      fetchFilteredTasks(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      {/* Top Bar: Title & Action */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Task Management
          </h1>
          <p className="text-xs text-muted-foreground">
            Daftar seluruh tugas, filter berdasarkan status, prioritas, dan
            deadline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchFilteredTasks(filters)}
            disabled={isPending}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1 ${isPending ? "animate-spin" : ""}`}
            />
            Segarkan
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="h-8 gap-1.5 px-3 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Task</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-lg border border-border bg-card p-3 shadow-none">
        <TaskFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      </div>

      {/* Task Table */}
      <TaskTable
        tasks={tasks}
        isLoading={isPending}
        onRefresh={() => fetchFilteredTasks(filters)}
      />

      {/* Create Task Dialog */}
      <TaskFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => fetchFilteredTasks(filters)}
      />
    </div>
  );
}
