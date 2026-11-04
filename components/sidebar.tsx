"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, LayoutDashboard, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      name: "Task List",
      href: "/tasks",
      icon: ListTodo,
      active: pathname === "/tasks",
    },
  ];

  return (
    <aside
      className={cn(
        "flex h-full w-[230px] flex-col border-r border-border bg-sidebar select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center gap-2.5 px-5 border-b border-border/70">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background">
          <CheckSquare className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold tracking-tight text-foreground">
            TaskPilot
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            v1.0.0
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 px-3 py-4 space-y-1">
        <p className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                item.active
                  ? "bg-zinc-200/60 text-zinc-900 font-semibold"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  item.active ? "text-zinc-900" : "text-zinc-500 group-hover:text-zinc-900"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="border-t border-border/70 p-4">
        <div className="rounded-md bg-muted/60 p-2.5 text-[11px] text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground">Portfolio Project</p>
          <p className="mt-0.5">Next.js • PostgreSQL • Prisma</p>
        </div>
      </div>
    </aside>
  );
}

