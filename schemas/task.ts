import { z } from "zod";

export const taskStatusEnum = z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]);
export const taskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Judul task wajib diisi")
    .max(100, "Judul task maksimal 100 karakter")
    .trim(),
  description: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional().nullable(),
  status: taskStatusEnum.default("TODO"),
  priority: taskPriorityEnum.default("MEDIUM"),
  dueDate: z.string().optional().nullable().or(z.date().optional().nullable()),
});

export const updateTaskSchema = z.object({
  id: z.string().uuid("ID task tidak valid"),
  title: z
    .string()
    .min(1, "Judul task wajib diisi")
    .max(100, "Judul task maksimal 100 karakter")
    .trim(),
  description: z.string().max(1000, "Deskripsi maksimal 1000 karakter").optional().nullable(),
  status: taskStatusEnum,
  priority: taskPriorityEnum,
  dueDate: z.string().optional().nullable().or(z.date().optional().nullable()),
});

export const updateTaskStatusSchema = z.object({
  id: z.string().uuid("ID task tidak valid"),
  status: taskStatusEnum,
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

