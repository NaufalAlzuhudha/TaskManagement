import React from "react";
import { Badge } from "@/components/ui/badge";
import { TaskStatus } from "@/types";

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  switch (status) {
    case "TODO":
      return (
        <Badge variant="todo" className="gap-1.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
          Todo
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge variant="in_progress" className="gap-1.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          In Progress
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge variant="completed" className="gap-1.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Completed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

