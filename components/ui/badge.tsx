import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-red-50 text-red-700 border-red-200",
        outline: "text-foreground border-border",
        // Task Status Variants
        todo: "border-zinc-200 bg-zinc-50 text-zinc-700 font-normal",
        in_progress: "border-blue-200 bg-blue-50 text-blue-700 font-normal",
        completed: "border-emerald-200 bg-emerald-50 text-emerald-700 font-normal",
        // Task Priority Variants
        low: "border-zinc-200 bg-zinc-50 text-zinc-600 font-normal",
        medium: "border-amber-200 bg-amber-50 text-amber-700 font-normal",
        high: "border-rose-200 bg-rose-50 text-rose-700 font-normal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

