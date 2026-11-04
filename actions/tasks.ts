"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from "@/schemas/task";
import { ActionResponse, DashboardStats, Task, TaskFilterParams, TaskStatus } from "@/types";

export async function getTasks(params?: TaskFilterParams): Promise<ActionResponse<Task[]>> {
  try {
    const where: Prisma.TaskWhereInput = {};

    // Search by title or description
    if (params?.search && params.search.trim() !== "") {
      where.OR = [
        { title: { contains: params.search.trim(), mode: "insensitive" } },
        { description: { contains: params.search.trim(), mode: "insensitive" } },
      ];
    }

    // Filter by status
    if (params?.status && params.status !== "ALL") {
      where.status = params.status;
    }

    // Filter by priority
    if (params?.priority && params.priority !== "ALL") {
      where.priority = params.priority;
    }

    // Filter by due date
    if (params?.dueDateFilter && params.dueDateFilter !== "ALL") {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      if (params.dueDateFilter === "OVERDUE") {
        where.dueDate = { lt: startOfToday };
        where.status = { not: "COMPLETED" };
      } else if (params.dueDateFilter === "TODAY") {
        where.dueDate = { gte: startOfToday, lte: endOfToday };
      } else if (params.dueDateFilter === "THIS_WEEK") {
        const next7Days = new Date(startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);
        where.dueDate = { gte: startOfToday, lte: next7Days };
      } else if (params.dueDateFilter === "UPCOMING") {
        where.dueDate = { gte: startOfToday };
      }
    }

    // Sorting
    const orderBy: Prisma.TaskOrderByWithRelationInput = {};
    const sortBy = params?.sortBy || "createdAt";
    const sortOrder = params?.sortOrder || "desc";

    if (sortBy === "priority") {
      orderBy.priority = sortOrder;
    } else if (sortBy === "dueDate") {
      orderBy.dueDate = { sort: sortOrder, nulls: "last" };
    } else if (sortBy === "title") {
      orderBy.title = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
    });

    return { success: true, data: tasks };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return {
      success: false,
      error: "Gagal mengambil data tugas dari database. Pastikan koneksi database aktif.",
    };
  }
}

export async function getTaskById(id: string): Promise<ActionResponse<Task>> {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return { success: false, error: "Tugas tidak ditemukan." };
    }

    return { success: true, data: task };
  } catch (error) {
    console.error("Error fetching task:", error);
    return { success: false, error: "Gagal mengambil detail tugas." };
  }
}

export async function createTask(rawInput: unknown): Promise<ActionResponse<Task>> {
  try {
    const validation = createTaskSchema.safeParse(rawInput);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || "Data tidak valid",
      };
    }

    const { title, description, status, priority, dueDate } = validation.data;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/tasks");

    return { success: true, data: task };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Gagal menambahkan tugas baru ke database." };
  }
}

export async function updateTask(rawInput: unknown): Promise<ActionResponse<Task>> {
  try {
    const validation = updateTaskSchema.safeParse(rawInput);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || "Data tidak valid",
      };
    }

    const { id, title, description, status, priority, dueDate } = validation.data;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return { success: false, error: "Tugas tidak ditemukan." };
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description: description || null,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    revalidatePath("/");
    revalidatePath("/tasks");

    return { success: true, data: task };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Gagal memperbarui data tugas." };
  }
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<ActionResponse<Task>> {
  try {
    const validation = updateTaskStatusSchema.safeParse({ id, status });
    if (!validation.success) {
      return { success: false, error: "Status tidak valid" };
    }

    const task = await prisma.task.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/");
    revalidatePath("/tasks");

    return { success: true, data: task };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Gagal memperbarui status tugas." };
  }
}

export async function deleteTask(id: string): Promise<ActionResponse<{ id: string }>> {
  try {
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return { success: false, error: "Tugas tidak ditemukan atau sudah dihapus." };
    }

    await prisma.task.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/tasks");

    return { success: true, data: { id } };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Gagal menghapus tugas dari database." };
  }
}

export async function getDashboardStats(): Promise<ActionResponse<DashboardStats>> {
  try {
    const [total, todo, inProgress, completed, upcomingDeadlines, recentTasks] =
      await Promise.all([
        prisma.task.count(),
        prisma.task.count({ where: { status: "TODO" } }),
        prisma.task.count({ where: { status: "IN_PROGRESS" } }),
        prisma.task.count({ where: { status: "COMPLETED" } }),
        prisma.task.findMany({
          where: {
            dueDate: { not: null },
            status: { not: "COMPLETED" },
          },
          orderBy: { dueDate: "asc" },
          take: 5,
        }),
        prisma.task.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const [lowCount, mediumCount, highCount] = await Promise.all([
      prisma.task.count({ where: { priority: "LOW" } }),
      prisma.task.count({ where: { priority: "MEDIUM" } }),
      prisma.task.count({ where: { priority: "HIGH" } }),
    ]);

    const statusDistribution = [
      { name: "To Do", value: todo, color: "#71717A" },
      { name: "In Progress", value: inProgress, color: "#3B82F6" },
      { name: "Completed", value: completed, color: "#10B981" },
    ];

    const priorityDistribution = [
      { name: "Low", value: lowCount, color: "#71717A" },
      { name: "Medium", value: mediumCount, color: "#F59E0B" },
      { name: "High", value: highCount, color: "#EF4444" },
    ];

    return {
      success: true,
      data: {
        total,
        todo,
        inProgress,
        completed,
        completionRate,
        upcomingDeadlines,
        recentTasks,
        statusDistribution,
        priorityDistribution,
      },
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return {
      success: false,
      error: "Gagal mengambil statistik dashboard dari database.",
    };
  }
}
