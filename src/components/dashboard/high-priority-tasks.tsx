import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListTodo, Plus, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

const tasks = [
  {
    id: 1,
    title: "Data Structures Project",
    course: "Computer Science 301",
    dueDate: "Today, 11:59 PM",
    isUrgent: true,
  },
  {
    id: 2,
    title: "Read Chapter 4 & 5",
    course: "Introduction to Psychology",
    dueDate: "Tomorrow, 9:00 AM",
    isUrgent: false,
  },
  {
    id: 3,
    title: "Calculus Worksheet 12",
    course: "Mathematics 201",
    dueDate: "Wednesday",
    isUrgent: false,
  },
];

export function HighPriorityTasks() {
  return (
    <Card className="flex flex-col border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary" />
          High Priority Tasks
        </CardTitle>
        <Button variant="outline" className="justify-center gap-2" asChild>
          <Link href="/dashboard/tasks/new">
            <Plus className="h-4 w-4" /> Quick Add Task
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 mt-4">
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                    task.isUrgent
                      ? "bg-destructive animate-pulse"
                      : "bg-primary"
                  }`}
                />
                <div>
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {task.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {task.course}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-background px-2.5 py-1 rounded-full border border-border shrink-0">
                <Clock className="h-3 w-3" />
                {task.dueDate}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-row-reverse">
          <Button variant="link" className="mt-2  gap-2" asChild>
            <Link href="/dashboard/tasks">
              View All Tasks <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
