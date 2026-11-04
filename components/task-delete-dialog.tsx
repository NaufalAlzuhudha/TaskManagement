"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteTask } from "@/actions/tasks";
import { Task } from "@/types";

interface TaskDeleteDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TaskDeleteDialog({
  task,
  open,
  onOpenChange,
  onSuccess,
}: TaskDeleteDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!task) return null;

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await deleteTask(task.id);
        if (!res.success) {
          toast.error(res.error || "Gagal menghapus task");
          return;
        }

        toast.success("Task berhasil dihapus");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } catch {
        toast.error("Terjadi kesalahan saat menghapus data.");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold">
            Hapus Tugas Ini?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs leading-relaxed">
            Apakah Anda yakin ingin menghapus tugas{" "}
            <span className="font-medium text-foreground">
              &quot;{task.title}&quot;
            </span>
            ? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} className="text-xs">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="text-xs"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus Task"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
