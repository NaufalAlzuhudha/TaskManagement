"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sidebar } from "@/components/sidebar";
import { TaskFormDialog } from "@/components/task-form-dialog";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const getPageInfo = () => {
    switch (pathname) {
      case "/tasks":
        return {
          title: "All Tasks",
          breadcrumb: "Workspace / Tasks",
          description: "Manage, filter, and organize all your operational tasks",
        };
      case "/":
      default:
        return {
          title: "Dashboard",
          breadcrumb: "Workspace / Overview",
          description: "High-level metrics and current task distribution",
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-8 w-8 text-zinc-600"
                aria-label="Toggle Navigation"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 max-w-[250px] left-0 top-0 translate-x-0 translate-y-0 h-full rounded-none border-r border-border">
              <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
            </DialogContent>
          </Dialog>

          {/* Breadcrumb Context */}
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-muted-foreground">
              {pageInfo.breadcrumb}
            </span>
            <span className="text-sm font-semibold text-foreground tracking-tight">
              {pageInfo.title}
            </span>
          </div>
        </div>

        {/* Global Action */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
            className="h-8 gap-1.5 px-3 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Task</span>
          </Button>
        </div>
      </header>

      {/* Global Create Task Modal */}
      <TaskFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
}

