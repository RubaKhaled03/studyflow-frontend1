"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Plus } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  viewMode: "month" | "week" | "day" | "agenda";
  onViewChange: (view: "month" | "week" | "day" | "agenda") => void;
  onAddEvent?: () => void;
}

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday,
  viewMode,
  onViewChange,
  onAddEvent,
}: CalendarHeaderProps) {
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const viewOptions = [
    { id: "month", label: "Month" },
    { id: "week", label: "Week" },
    { id: "day", label: "Day" },
    { id: "agenda", label: "Agenda" },
  ] as const;

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-40">
      <div className="px-4 py-4 sm:px-6">
        {/* Top Row: Title and Quick Actions */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Academic Calendar
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onAddEvent}
              className="gap-2 hidden sm:flex"
            >
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
            {/* Search is optional for this version */}
          </div>
        </div>

        {/* Bottom Row: Navigation and View Options */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left: Navigation */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onPreviousMonth}
              className="p-2 h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onToday}
              className="min-w-fit"
            >
              Today
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onNextMonth}
              className="p-2 h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Current Date Range */}
            <div className="ml-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {monthYear}
            </div>
          </div>

          {/* Right: View Options */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
            {viewOptions.map((option) => (
              <Button
                key={option.id}
                size="sm"
                variant={viewMode === option.id ? "default" : "ghost"}
                onClick={() => onViewChange(option.id)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
