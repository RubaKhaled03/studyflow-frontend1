"use client";

import { useState } from "react";
import { WeeklyPlan } from "@/types/course";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  CheckCircle2,
  FileText,
  BookOpen,
  Clock,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WeeklyTimelineProps {
  weeks: WeeklyPlan[];
  onTaskComplete?: (
    weekNumber: number,
    taskId: string,
    completed: boolean,
  ) => void;
}

export function WeeklyTimeline({ weeks, onTaskComplete }: WeeklyTimelineProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([]);

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekNumber)
        ? prev.filter((w) => w !== weekNumber)
        : [...prev, weekNumber],
    );
  };

  const isWeekExpanded = (weekNumber: number) =>
    expandedWeeks.includes(weekNumber);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "graded":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "pending":
        return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
      default:
        return "bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800";
    }
  };

  const getAssignmentStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0">
            Submitted
          </Badge>
        );
      case "graded":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0">
            Graded
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-0">
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {weeks.map((week) => (
        <Card
          key={week.weekNumber}
          className={cn(
            "border-slate-200 dark:border-slate-800 transition-colors overflow-hidden",
            isWeekExpanded(week.weekNumber)
              ? "bg-white dark:bg-slate-900"
              : "bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900/70",
          )}
        >
          {/* Week Header */}
          <button
            onClick={() => toggleWeek(week.weekNumber)}
            className="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors text-left"
          >
            <ChevronDown
              className={cn(
                "h-5 w-5 text-slate-500 transition-transform shrink-0",
                isWeekExpanded(week.weekNumber) ? "rotate-180" : "",
              )}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Week {week.weekNumber}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {week.title}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                {week.studyTasks.length +
                  week.assignments.length +
                  week.exams.length}{" "}
                items
              </span>
            </div>
          </button>

          {/* Week Content */}
          {isWeekExpanded(week.weekNumber) && (
            <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-4 space-y-6 bg-white/50 dark:bg-slate-900/50">
              {/* Study Tasks */}
              {week.studyTasks.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Study Tasks
                  </h4>
                  <div className="space-y-2 ml-6">
                    {week.studyTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30 hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <Checkbox
                          checked={task.completed ?? false}
                          onCheckedChange={(checked) => {
                            onTaskComplete?.(
                              week.weekNumber,
                              task.id,
                              checked === true,
                            );
                          }}
                          className="mt-0.5"
                        />
                        <span
                          className={cn(
                            "text-sm flex-1",
                            task.completed
                              ? "line-through text-slate-500 dark:text-slate-500"
                              : "text-slate-900 dark:text-slate-100",
                          )}
                        >
                          {task.title}
                        </span>
                        {task.completed && (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments */}
              {week.assignments.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Assignments
                  </h4>
                  <div className="space-y-2 ml-6">
                    {week.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-colors",
                          getAssignmentStatusColor(assignment.status),
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-slate-900 dark:text-white text-sm">
                              {assignment.title}
                            </h5>
                            {assignment.description && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                {assignment.description}
                              </p>
                            )}
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                              Due: {formatDate(assignment.dueDate)}
                            </p>
                          </div>
                          <div className="shrink-0">
                            {getAssignmentStatusBadge(assignment.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exams & Quizzes */}
              {week.exams.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
                    Exams & Quizzes
                  </h4>
                  <div className="space-y-2 ml-6">
                    {week.exams.map((exam) => (
                      <div
                        key={exam.id}
                        className="p-4 rounded-lg border-2 border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/10 hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-slate-900 dark:text-white text-sm">
                              {exam.title}
                            </h5>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {exam.time}
                              </span>
                              <span className="px-2 py-0.5 bg-slate-200/50 dark:bg-slate-700/50 rounded">
                                {exam.duration} min
                              </span>
                              {exam.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {exam.location}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                              Date: {formatDate(exam.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {week.studyTasks.length === 0 &&
                week.assignments.length === 0 &&
                week.exams.length === 0 && (
                  <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                    <p className="text-sm">
                      No items planned for this week yet.
                    </p>
                  </div>
                )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
