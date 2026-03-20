import { Card, CardContent } from "@/components/ui/card";
import { ListTodo, BookOpen, Flame, CheckCircle2 } from "lucide-react";

interface QuickStatsProps {
  activeCourses: number;
  pendingTasks: number;
  completedCredits: number;
  milestones: number;
}

export function QuickStats({ 
  activeCourses, 
  pendingTasks, 
  completedCredits, 
  milestones 
}: QuickStatsProps) {
  const stats = [
    {
      title: "Active Tasks",
      value: pendingTasks,
      icon: ListTodo,
      textColor: "text-blue-600 dark:text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Current Courses",
      value: activeCourses,
      icon: BookOpen,
      textColor: "text-violet-600 dark:text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      title: "Credits Passed",
      value: completedCredits,
      icon: Flame,
      textColor: "text-orange-600 dark:text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Milestones Done",
      value: milestones,
      icon: CheckCircle2,
      textColor: "text-emerald-600 dark:text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group bg-card"
        >
          <CardContent className="flex items-center gap-3 pt-5">
            <div className={`p-2.5 rounded-xl shrink-0 ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
