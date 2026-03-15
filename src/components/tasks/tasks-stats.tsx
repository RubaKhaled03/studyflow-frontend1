import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStatsSummary } from "@/types/tasks";
import { Layers, CheckCircle2, AlertCircle, AlertTriangle, CalendarCheck2 } from "lucide-react";

interface TasksStatsProps {
  stats: TaskStatsSummary;
}

export function TasksStats({ stats }: TasksStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      
      <Card className="border-border/60 shadow-sm bg-card hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Layers className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {stats.total}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-card hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {stats.completed}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-card hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-400 to-rose-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold tracking-tight ${stats.overdue > 0 ? 'text-red-600' : 'text-foreground'}`}>
            {stats.overdue}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm bg-card hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 to-amber-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
          <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent className="flex justify-between items-end">
          <div className={`text-3xl font-bold tracking-tight ${stats.highPriority > 0 ? 'text-orange-600' : 'text-foreground'}`}>
            {stats.highPriority}
          </div>
          
          {stats.dueToday > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold bg-red-50 px-2 py-1 rounded-md border border-red-100">
                  <CalendarCheck2 className="w-3.5 h-3.5" />
                  {stats.dueToday} due today
              </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
