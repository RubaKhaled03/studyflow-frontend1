import { Card, CardContent } from "@/components/ui/card";
import { ListTodo, BookOpen, Flame, CheckCircle2 } from "lucide-react";

const stats = [
  {
    title: "Active Tasks",
    value: "8 Tasks",
    icon: ListTodo,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Current Courses",
    value: "5 Courses",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Daily Streak",
    value: "12 Days",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Completed",
    value: "24 Tasks",
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="hover:shadow-md transition-shadow duration-200 border-none bg-card/50 backdrop-blur-sm shadow-sm"
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                {stat.title === "Daily Streak"}
                {stat.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
