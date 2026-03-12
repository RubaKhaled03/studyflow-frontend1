"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  aggregateCalendarEvents,
  filterEvents,
  CalendarEvent,
  CalendarFilters,
} from "@/lib/calendar-utils";
import { getCourseById } from "@/lib/courses-storage";
import { getCourseDetails } from "@/lib/mock-course-details";
import { Course } from "@/types/course";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { MiniCalendar } from "@/components/calendar/mini-calendar";
import { CalendarFilters as FilterComponent } from "@/components/calendar/calendar-filters";
import { UpcomingDeadlines } from "@/components/calendar/upcoming-deadlines";
import { ColorLegend } from "@/components/calendar/color-legend";
import { MonthView } from "@/components/calendar/month-view";
import { WeekView } from "@/components/calendar/week-view";
import { DayView } from "@/components/calendar/day-view";
import { AgendaView } from "@/components/calendar/agenda-view";
import { EventDetailsModal } from "@/components/calendar/event-details-modal";
import { Spinner } from "@/components/ui/spinner";

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

function getClientSnapshot() {
  return true;
}

function useHydrated() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

export default function CalendarPage() {
  const router = useRouter();
  const mounted = useHydrated();

  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day" | "agenda">(
    "month",
  );
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [showEventDetails, setShowEventDetails] = useState(false);

  const [filters, setFilters] = useState<CalendarFilters>({
    tasks: true,
    assignments: true,
    quizzes: true,
    exams: true,
    completed: true,
    courses: [],
  });

  // Load all courses
  useEffect(() => {
    if (!mounted) return;

    const loadCourses = async () => {
      try {
        // Try to get from localStorage first
        const allCourses: Course[] = [];

        // Get common course IDs (from localStorage or mock)
        const courseIds = ["1", "2", "3"];

        courseIds.forEach((id) => {
          let course = getCourseById(id);
          if (!course) {
            course = getCourseDetails(id);
          }
          if (course) {
            allCourses.push(course);
          }
        });

        setCourses(allCourses);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading courses:", error);
        setIsLoading(false);
      }
    };

    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        loadCourses();
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [mounted]);

  // Get all events
  const allEvents = aggregateCalendarEvents(courses);
  const filteredEvents = filterEvents(allEvents, filters);

  // Navigation handlers
  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleEventDetailsClose = () => {
    setShowEventDetails(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const handleOpenCourse = (courseId: string) => {
    handleEventDetailsClose();
    router.push(`/courses/${courseId}`);
  };

  if (isLoading || !mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        viewMode={viewMode}
        onViewChange={setViewMode}
      />

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)] lg:sticky lg:top-20">
          <MiniCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          <FilterComponent
            filters={filters}
            onFiltersChange={setFilters}
            courses={courses.map((c) => ({
              id: c.id,
              title: c.title,
              code: c.code,
            }))}
          />

          <UpcomingDeadlines
            events={filteredEvents}
            onEventClick={handleEventClick}
          />

          <ColorLegend />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {viewMode === "month" && (
            <MonthView
              events={filteredEvents}
              currentDate={currentDate}
              onEventClick={handleEventClick}
              onDateClick={setSelectedDate}
            />
          )}

          {viewMode === "week" && (
            <WeekView
              events={filteredEvents}
              currentDate={selectedDate}
              onEventClick={handleEventClick}
            />
          )}

          {viewMode === "day" && (
            <DayView
              events={filteredEvents}
              currentDate={selectedDate}
              onEventClick={handleEventClick}
            />
          )}

          {viewMode === "agenda" && (
            <AgendaView
              events={filteredEvents}
              currentDate={currentDate}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={showEventDetails}
        onClose={handleEventDetailsClose}
        onOpenCourse={handleOpenCourse}
      />
    </div>
  );
}
