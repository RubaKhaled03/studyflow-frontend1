import { Card, CardContent } from "@/components/ui/card";
import { TaskStatsSummary } from "@/types/tasks";
import { Layers, CheckCircle2, AlertCircle, AlertTriangle, CalendarCheck2 } from "lucide-react";

interface TasksStatsProps {
  stats: TaskStatsSummary;
}

export function TasksStats({ stats }: TasksStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Tasks */}
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group bg-card">
        <CardContent className="flex items-center gap-3 pt-5">
          <div className="p-2.5 rounded-xl shrink-0 bg-blue-50 dark:bg-blue-900/20">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{stats.total}</p>
            <p className="text-xs text-muted-foreground font-medium">Total Tasks</p>
          </div>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group bg-card">
        <CardContent className="flex items-center gap-3 pt-5">
          <div className="p-2.5 rounded-xl shrink-0 bg-emerald-50 dark:bg-emerald-900/20">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{stats.completed}</p>
            <p className="text-xs text-muted-foreground font-medium">Completed Tasks</p>
          </div>
        </CardContent>
      </Card>

      {/* Overdue */}
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group bg-card">
        <CardContent className="flex items-center gap-3 pt-5">
          <div className="p-2.5 rounded-xl shrink-0 bg-red-50 dark:bg-red-900/20">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500" />
          </div>
          <div>
            <p className={`text-2xl font-bold tabular-nums ${stats.overdue > 0 ? 'text-red-600 dark:text-red-500' : 'text-foreground'}`}>
              {stats.overdue}
            </p>
            <p className="text-xs text-muted-foreground font-medium">Overdue Tasks</p>
          </div>
        </CardContent>
      </Card>

      {/* High Priority & Due Today */}
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group bg-card">
        <CardContent className="flex flex-col gap-1 pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl shrink-0 bg-amber-50 dark:bg-amber-900/20">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              </div>
              <div className="flex-1 flex justify-between items-start">
                <div>
                  <p className={`text-2xl font-bold tabular-nums ${stats.highPriority > 0 ? 'text-amber-600 dark:text-amber-500' : 'text-foreground'}`}>
                    {stats.highPriority}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">High Priority</p>
                </div>
              </div>
            </div>
            {stats.dueToday > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-2.5 py-1.5 rounded-md border border-red-100 dark:border-red-900/30 w-full truncate">
                    <CalendarCheck2 className="w-3 h-3 shrink-0" />
                    {stats.dueToday} due today
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
