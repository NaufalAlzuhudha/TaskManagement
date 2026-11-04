"use client";

import React, { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask, updateTask } from "@/actions/tasks";
import { createTaskSchema, CreateTaskInput } from "@/schemas/task";
import { Task, TaskPriority, TaskStatus } from "@/types";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSuccess?: () => void;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  onSuccess,
}: TaskFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(task);

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate
          ? format(new Date(task.dueDate), "yyyy-MM-dd")
          : "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "",
      });
    }
  }, [task, form, open]);

  const onSubmit = (values: CreateTaskInput) => {
    startTransition(async () => {
      try {
        if (isEditing && task) {
          const res = await updateTask({
            id: task.id,
            ...values,
          });

          if (!res.success) {
            toast.error(res.error || "Gagal memperbarui task");
            return;
          }

          toast.success("Task berhasil diperbarui");
        } else {
          const res = await createTask(values);

          if (!res.success) {
            toast.error(res.error || "Gagal membuat task baru");
            return;
          }

          toast.success("Task baru berhasil dibuat");
        }

        form.reset();
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } catch {
        toast.error("Terjadi kesalahan tidak terduga.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {isEditing ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Perbarui informasi dan deadline tugas ini."
              : "Tambahkan tugas baru ke dalam alur kerja Anda."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">
              Judul Task <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Tambahkan judul tugas..."
              {...form.register("title")}
              disabled={isPending}
            />
            {form.formState.errors.title && (
              <p className="text-[11px] text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Tambahkan detail atau catatan pendukung..."
              rows={3}
              {...form.register("description")}
              disabled={isPending}
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(val) =>
                  form.setValue("status", val as TaskStatus)
                }
                disabled={isPending}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">Todo</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="priority">Prioritas</Label>
              <Select
                value={form.watch("priority")}
                onValueChange={(val) =>
                  form.setValue("priority", val as TaskPriority)
                }
                disabled={isPending}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Batas Waktu (Deadline)</Label>
            <Input
              id="dueDate"
              type="date"
              {...form.register("dueDate")}
              disabled={isPending}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending
                ? "Menyimpan..."
                : isEditing
                  ? "Simpan Perubahan"
                  : "Buat Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
