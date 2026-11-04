"use client";

import React from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskStatusBadge } from "@/components/task-status-badge";
import { TaskPriorityBadge } from "@/components/task-priority-badge";
import { Task } from "@/types";

interface TaskDetailDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: TaskDetailDialogProps) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
          </div>
          <DialogTitle className="text-base font-semibold leading-snug text-left pt-1">
            {task.title}
          </DialogTitle>
          <DialogDescription className="text-left">
            ID: <span className="font-mono text-[10px]">{task.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Description */}
          <div>
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Deskripsi
            </h4>
            <div className="rounded-md border border-border/70 bg-muted/30 p-3 text-xs text-foreground leading-relaxed whitespace-pre-wrap min-h-[60px]">
              {task.description || "Tidak ada deskripsi yang ditambahkan."}
            </div>
          </div>

          {/* Dates metadata */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/60">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" /> Batas Waktu
              </span>
              <p className="text-xs font-medium text-foreground">
                {task.dueDate
                  ? format(new Date(task.dueDate), "dd MMMM yyyy", {
                    locale: idLocale,
                  })
                  : "Tidak ada deadline"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Dibuat Pada
              </span>
              <p className="text-xs font-medium text-foreground">
                {format(new Date(task.createdAt), "dd MMM yyyy, HH:mm", {
                  locale: idLocale,
                })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

