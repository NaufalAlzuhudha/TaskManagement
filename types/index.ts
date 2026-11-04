import { Task as PrismaTask, TaskStatus, TaskPriority } from "@prisma/client";

export { TaskStatus, TaskPriority };
export type Task = PrismaTask;

export type TaskStatusType = keyof typeof TaskStatus;
export type TaskPriorityType = keyof typeof TaskPriority;

export interface TaskFilterParams {
  search?: string;
  status?: TaskStatus | "ALL";
  priority?: TaskPriority | "ALL";
  dueDateFilter?: "ALL" | "OVERDUE" | "TODAY" | "THIS_WEEK" | "UPCOMING";
  sortBy?: "createdAt" | "dueDate" | "title" | "priority";
  sortOrder?: "asc" | "desc";
}

export interface DashboardStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  completionRate: number;
  upcomingDeadlines: Task[];
  recentTasks: Task[];
  statusDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
  priorityDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

