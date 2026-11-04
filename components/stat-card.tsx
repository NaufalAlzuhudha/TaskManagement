import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  badge?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  badge,
}: StatCardProps) {
  return (
    <Card className="hover:border-zinc-300 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {title}
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-foreground">
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="mt-2.5 flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </div>
          {badge && (
            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-[11px] text-muted-foreground truncate">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

