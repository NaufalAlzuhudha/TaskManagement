import { getTasks } from "@/actions/tasks";
import { TasksView } from "@/components/tasks-view";
import { TaskFilterParams, TaskPriority, TaskStatus } from "@/types";

export const dynamic = "force-dynamic";

interface TasksPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const resolvedSearchParams = await searchParams;

  const statusParam = resolvedSearchParams.status;
  const priorityParam = resolvedSearchParams.priority;
  const dueDateParam = resolvedSearchParams.dueDateFilter;
  const sortByParam = resolvedSearchParams.sortBy;
  const sortOrderParam = resolvedSearchParams.sortOrder;

  const initialFilters: TaskFilterParams = {
    search: typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "",
    status:
      typeof statusParam === "string" && ["TODO", "IN_PROGRESS", "COMPLETED"].includes(statusParam)
        ? (statusParam as TaskStatus)
        : "ALL",
    priority:
      typeof priorityParam === "string" && ["LOW", "MEDIUM", "HIGH"].includes(priorityParam)
        ? (priorityParam as TaskPriority)
        : "ALL",
    dueDateFilter:
      typeof dueDateParam === "string" &&
      ["ALL", "OVERDUE", "TODAY", "THIS_WEEK", "UPCOMING"].includes(dueDateParam)
        ? (dueDateParam as TaskFilterParams["dueDateFilter"])
        : "ALL",
    sortBy:
      typeof sortByParam === "string" &&
      ["createdAt", "dueDate", "title", "priority"].includes(sortByParam)
        ? (sortByParam as TaskFilterParams["sortBy"])
        : "createdAt",
    sortOrder:
      typeof sortOrderParam === "string" && ["asc", "desc"].includes(sortOrderParam)
        ? (sortOrderParam as "asc" | "desc")
        : "desc",
  };

  const tasksRes = await getTasks(initialFilters);
  const tasks = tasksRes.success && tasksRes.data ? tasksRes.data : [];

  return <TasksView initialTasks={tasks} initialFilters={initialFilters} />;
}
