"use client";

import { Notification } from "@/types/notifications";
import { cn } from "@/lib/utils";
import { 
  Bell, 
  BookOpen, 
  CalendarDays, 
  CheckCircle2, 
  Clock, 
  Info,
  LucideIcon 
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/date-utils";

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: string) => void;
}

const typeIcons: Record<string, LucideIcon> = {
  task: CheckCircle2,
  course: BookOpen,
  exam: Clock,
  assignment: BookOpen,
  reflection: Info,
  system: Info,
  reminder: Bell,
};

const typeColors: Record<string, string> = {
  task: "text-green-500 bg-green-50 dark:bg-green-500/10",
  course: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
  exam: "text-red-500 bg-red-50 dark:bg-red-500/10",
  assignment: "text-orange-500 bg-orange-50 dark:bg-orange-500/10",
  reflection: "text-purple-500 bg-purple-50 dark:bg-purple-500/10",
  system: "text-slate-500 bg-slate-50 dark:bg-slate-500/10",
  reminder: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
};

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon = typeIcons[notification.type] || Info;
  const colorClass = typeColors[notification.type] || "text-slate-500 bg-slate-50";

  return (
    <div 
      onClick={() => onClick(notification.id)}
      className={cn(
        "flex gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors relative group",
        !notification.read && "bg-primary/5 dark:bg-primary/10"
      )}
    >
      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", colorClass)}>
        <Icon className="h-5 w-5" />
      </div>
      
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className={cn(
            "text-sm font-medium leading-none truncate",
            !notification.read ? "text-foreground" : "text-muted-foreground"
          )}>
            {notification.title}
          </p>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap pt-0.5">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
      </div>

      {!notification.read && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
      )}
    </div>
  );
}
