"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskFilterParams, TaskPriority, TaskStatus } from "@/types";

interface TaskFiltersProps {
  filters: TaskFilterParams;
  onChange: (filters: TaskFilterParams) => void;
  onReset: () => void;
}

export function TaskFilters({ filters, onChange, onReset }: TaskFiltersProps) {
  const isFiltered =
    Boolean(filters.search) ||
    (filters.status && filters.status !== "ALL") ||
    (filters.priority && filters.priority !== "ALL") ||
    (filters.dueDateFilter && filters.dueDateFilter !== "ALL") ||
    filters.sortBy !== "createdAt" ||
    filters.sortOrder !== "desc";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-1">
      {/* Search Input */}
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari tugas..."
          value={filters.search || ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-8 text-xs h-9 bg-background"
        />
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status */}
        <Select
          value={filters.status || "ALL"}
          onValueChange={(val) =>
            onChange({ ...filters, status: val as TaskStatus | "ALL" })
          }
        >
          <SelectTrigger className="w-[120px] h-9 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Status</SelectItem>
            <SelectItem value="TODO">Todo</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority */}
        <Select
          value={filters.priority || "ALL"}
          onValueChange={(val) =>
            onChange({ ...filters, priority: val as TaskPriority | "ALL" })
          }
        >
          <SelectTrigger className="w-[125px] h-9 text-xs">
            <SelectValue placeholder="Prioritas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Prioritas</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>

        {/* Due Date Filter */}
        <Select
          value={filters.dueDateFilter || "ALL"}
          onValueChange={(val) =>
            onChange({
              ...filters,
              dueDateFilter: val as TaskFilterParams["dueDateFilter"],
            })
          }
        >
          <SelectTrigger className="w-[130px] h-9 text-xs">
            <SelectValue placeholder="Deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Deadline</SelectItem>
            <SelectItem value="TODAY">Hari Ini</SelectItem>
            <SelectItem value="THIS_WEEK">7 Hari Ke Depan</SelectItem>
            <SelectItem value="OVERDUE">Terlewat (Overdue)</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={`${filters.sortBy || "createdAt"}-${filters.sortOrder || "desc"}`}
          onValueChange={(val) => {
            const [sortBy, sortOrder] = val.split("-");
            onChange({
              ...filters,
              sortBy: sortBy as TaskFilterParams["sortBy"],
              sortOrder: sortOrder as "asc" | "desc",
            });
          }}
        >
          <SelectTrigger className="w-[140px] h-9 text-xs">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Terbaru Dibuat</SelectItem>
            <SelectItem value="createdAt-asc">Terlama Dibuat</SelectItem>
            <SelectItem value="dueDate-asc">Deadline Terdekat</SelectItem>
            <SelectItem value="dueDate-desc">Deadline Terjauh</SelectItem>
            <SelectItem value="title-asc">Nama A-Z</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset button */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
