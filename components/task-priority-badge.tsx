import React from "react";
import { Badge } from "@/components/ui/badge";
import { TaskPriority } from "@/types";

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  switch (priority) {
    case "LOW":
      return (
        <Badge variant="low" className="gap-1.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
          Low
        </Badge>
      );
    case "MEDIUM":
      return (
        <Badge variant="medium" className="gap-1.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Medium
        </Badge>
      );
    case "HIGH":
      return (
        <Badge variant="high" className="gap-1.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          High
        </Badge>
      );
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}

