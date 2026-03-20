import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      subtitle: "Pending to do",
      value: pendingTasks,
      icon: ListTodo,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      title: "Current Courses",
      subtitle: "Enrolled this term",
      value: activeCourses,
      icon: BookOpen,
      color: "text-violet-600",
      bg: "bg-violet-500/10",
    },
    {
      title: "Credits Passed",
      subtitle: "Academic progress",
      value: completedCredits,
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-500/10",
    },
    {
      title: "Milestones Done",
      subtitle: "Completed goals",
      value: milestones,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="border shadow-sm bg-card hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`w-8 h-8 rounded-full ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
             <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
