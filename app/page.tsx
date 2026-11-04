import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { getDashboardStats } from "@/actions/tasks";
import { StatCard } from "@/components/stat-card";
import { DashboardCharts } from "@/components/dashboard-charts";
import { TaskStatusBadge } from "@/components/task-status-badge";
import { TaskPriorityBadge } from "@/components/task-priority-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const statsRes = await getDashboardStats();

  if (!statsRes.success || !statsRes.data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
        <AlertCircle className="h-10 w-10 text-amber-500 mb-3" />
        <h2 className="text-base font-semibold text-foreground">
          Koneksi Database Belum Terhubung
        </h2>
        <p className="mt-1 text-xs text-muted-foreground max-w-md">
          {statsRes.error ||
            "Pastikan Anda telah mengisi DATABASE_URL yang valid di file .env dan menjalankan prisma db push."}
        </p>
        <div className="mt-4 rounded-md bg-muted p-3 text-left font-mono text-[11px] text-zinc-700">
          <p>1. Edit file .env: DATABASE_URL=&quot;...&quot;</p>
          <p>2. Jalankan perintah: pnpm db:push</p>
        </div>
      </div>
    );
  }

  const {
    total,
    todo,
    inProgress,
    completed,
    completionRate,
    upcomingDeadlines,
    recentTasks,
    statusDistribution,
    priorityDistribution,
  } = statsRes.data;

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Summary Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-xs text-muted-foreground">
            Ringkasan progres dan status seluruh tugas proyek Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/tasks">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <span>Buka Task List</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={total}
          icon={ListTodo}
          description="Seluruh task terdaftar"
        />
        <StatCard
          title="To Do"
          value={todo}
          icon={Clock}
          description="Belum dikerjakan"
          badge={total > 0 ? `${Math.round((todo / total) * 100)}%` : undefined}
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={TrendingUp}
          description="Sedang berlangsung"
          badge={
            total > 0
              ? `${Math.round((inProgress / total) * 100)}%`
              : undefined
          }
        />
        <StatCard
          title="Completed"
          value={completed}
          icon={CheckCircle2}
          description={`Tingkat selesai ${completionRate}%`}
          badge={total > 0 ? `${completionRate}%` : undefined}
        />
      </div>

      {/* Visual Analytics / Charts */}
      <DashboardCharts
        statusData={statusDistribution}
        priorityData={priorityDistribution}
      />

      {/* 2-Column Split: Upcoming Deadlines & Recent Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>
                Tugas dengan tenggat waktu terdekat
              </CardDescription>
            </div>
            <Link
              href="/tasks?dueDateFilter=UPCOMING"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Lihat semua <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {upcomingDeadlines.length === 0 ? (
              <div className="flex h-36 flex-col items-center justify-center text-center text-xs text-muted-foreground">
                <Calendar className="h-6 w-6 text-zinc-300 mb-1.5" />
                <span>Tidak ada deadline tugas dalam waktu dekat</span>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {upcomingDeadlines.map((task) => {
                  const isOverdue =
                    task.dueDate &&
                    new Date(task.dueDate) < new Date() &&
                    task.status !== "COMPLETED";

                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between py-2.5"
                    >
                      <div className="space-y-0.5 max-w-[240px]">
                        <p className="text-xs font-medium text-foreground truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <TaskPriorityBadge priority={task.priority} />
                          <span
                            className={`text-[11px] ${isOverdue
                                ? "text-rose-600 font-medium"
                                : "text-muted-foreground"
                              }`}
                          >
                            {task.dueDate
                              ? format(
                                new Date(task.dueDate),
                                "dd MMM yyyy",
                                {
                                  locale: idLocale,
                                }
                              )
                              : "—"}
                          </span>
                        </div>
                      </div>
                      <TaskStatusBadge status={task.status} />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">
                Recent Tasks
              </CardTitle>
              <CardDescription>
                Tugas yang baru saja ditambahkan
              </CardDescription>
            </div>
            <Link
              href="/tasks"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Lihat semua <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {recentTasks.length === 0 ? (
              <div className="flex h-36 flex-col items-center justify-center text-center text-xs text-muted-foreground">
                <ListTodo className="h-6 w-6 text-zinc-300 mb-1.5" />
                <span>Belum ada tugas yang dibuat</span>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="space-y-0.5 max-w-[240px]">
                      <p className="text-xs font-medium text-foreground truncate">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {format(new Date(task.createdAt), "dd MMM, HH:mm", {
                          locale: idLocale,
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TaskPriorityBadge priority={task.priority} />
                      <TaskStatusBadge status={task.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
