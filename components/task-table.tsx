"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TaskStatusBadge } from "@/components/task-status-badge";
import { TaskPriorityBadge } from "@/components/task-priority-badge";
import { TaskFormDialog } from "@/components/task-form-dialog";
import { TaskDetailDialog } from "@/components/task-detail-dialog";
import { TaskDeleteDialog } from "@/components/task-delete-dialog";
import { updateTaskStatus } from "@/actions/tasks";
import { toast } from "sonner";
import { Task, TaskStatus } from "@/types";

interface TaskTableProps {
  tasks: Task[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function TaskTable({ tasks, onRefresh, isLoading }: TaskTableProps) {
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(
    null
  );
  const [selectedTaskForDetail, setSelectedTaskForDetail] =
    useState<Task | null>(null);
  const [selectedTaskForDelete, setSelectedTaskForDelete] =
    useState<Task | null>(null);

  const handleQuickStatusChange = async (task: Task, newStatus: TaskStatus) => {
    if (task.status === newStatus) return;

    try {
      const res = await updateTaskStatus(task.id, newStatus);
      if (!res.success) {
        toast.error(res.error || "Gagal mengubah status");
        return;
      }
      toast.success(`Status diubah menjadi ${newStatus}`);
      if (onRefresh) onRefresh();
    } catch {
      toast.error("Terjadi kesalahan sistem");
    }
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[340px] text-xs font-semibold">
                Task Name
              </TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">
                Status
              </TableHead>
              <TableHead className="w-[120px] text-xs font-semibold">
                Priority
              </TableHead>
              <TableHead className="w-[160px] text-xs font-semibold">
                Due Date
              </TableHead>
              <TableHead className="w-[160px] text-xs font-semibold hidden md:table-cell">
                Created At
              </TableHead>
              <TableHead className="w-[60px] text-right text-xs font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-xs text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Memuat data task...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-40 text-center text-xs text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="h-8 w-8 text-zinc-300 stroke-[1.5]" />
                    <p className="font-medium text-foreground">
                      Tidak ada task ditemukan
                    </p>
                    <p className="text-[11px] text-muted-foreground max-w-sm">
                      Belum ada tugas yang cocok dengan filter Anda, atau belum ada
                      tugas yang dibuat.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => {
                const isOverdue =
                  task.dueDate &&
                  new Date(task.dueDate) < new Date() &&
                  task.status !== "COMPLETED";

                return (
                  <TableRow
                    key={task.id}
                    className="group hover:bg-zinc-50/70 transition-colors"
                  >
                    {/* Task Title & Description Preview */}
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span
                          onClick={() => setSelectedTaskForDetail(task)}
                          className="cursor-pointer text-xs font-medium text-foreground hover:underline line-clamp-1"
                        >
                          {task.title}
                        </span>
                        {task.description && (
                          <span className="text-[11px] text-muted-foreground line-clamp-1">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <TaskStatusBadge status={task.status} />
                    </TableCell>

                    {/* Priority */}
                    <TableCell>
                      <TaskPriorityBadge priority={task.priority} />
                    </TableCell>

                    {/* Due Date */}
                    <TableCell>
                      {task.dueDate ? (
                        <div
                          className={`flex items-center gap-1.5 text-xs ${isOverdue
                              ? "text-rose-600 font-medium"
                              : "text-zinc-600"
                            }`}
                        >
                          <Calendar className="h-3 w-3 shrink-0 opacity-70" />
                          <span>
                            {format(new Date(task.dueDate), "dd MMM yyyy", {
                              locale: idLocale,
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-xs">—</span>
                      )}
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="hidden md:table-cell text-zinc-500 text-xs">
                      {format(new Date(task.createdAt), "dd MMM yyyy", {
                        locale: idLocale,
                      })}
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-zinc-500 hover:text-zinc-900"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => setSelectedTaskForDetail(task)}
                          >
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedTaskForEdit(task)}
                          >
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Edit Task
                          </DropdownMenuItem>

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                              Ubah Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="w-36">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleQuickStatusChange(task, "TODO")
                                }
                                disabled={task.status === "TODO"}
                              >
                                Todo
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleQuickStatusChange(task, "IN_PROGRESS")
                                }
                                disabled={task.status === "IN_PROGRESS"}
                              >
                                In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleQuickStatusChange(task, "COMPLETED")
                                }
                                disabled={task.status === "COMPLETED"}
                              >
                                Completed
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setSelectedTaskForDelete(task)}
                            className="text-red-600 focus:bg-red-50 focus:text-red-700"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Hapus Task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <TaskFormDialog
        open={Boolean(selectedTaskForEdit)}
        onOpenChange={(open) => {
          if (!open) setSelectedTaskForEdit(null);
        }}
        task={selectedTaskForEdit}
        onSuccess={() => {
          setSelectedTaskForEdit(null);
          if (onRefresh) onRefresh();
        }}
      />

      {/* Detail Dialog */}
      <TaskDetailDialog
        open={Boolean(selectedTaskForDetail)}
        onOpenChange={(open) => {
          if (!open) setSelectedTaskForDetail(null);
        }}
        task={selectedTaskForDetail}
      />

      {/* Delete Dialog */}
      <TaskDeleteDialog
        open={Boolean(selectedTaskForDelete)}
        onOpenChange={(open) => {
          if (!open) setSelectedTaskForDelete(null);
        }}
        task={selectedTaskForDelete}
        onSuccess={() => {
          setSelectedTaskForDelete(null);
          if (onRefresh) onRefresh();
        }}
      />
    </>
  );
}

