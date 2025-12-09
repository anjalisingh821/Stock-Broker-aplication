import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "destructive" | "warning" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100":
            variant === "default",
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200":
            variant === "success",
          "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200":
            variant === "destructive",
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200":
            variant === "warning",
          "border border-gray-300 text-gray-900 dark:border-gray-700 dark:text-gray-100":
            variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };

