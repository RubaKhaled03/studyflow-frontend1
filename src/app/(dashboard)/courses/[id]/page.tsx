"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useSyncExternalStore } from "react";
import { getCourseById, saveCourseToStorage } from "@/lib/courses-storage";
import { getCourseDetails } from "@/lib/mock-course-details";
import { Course } from "@/types/course";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { CourseHeroCard } from "@/components/course-details/course-hero-card";
import { WeeklyTimeline } from "@/components/course-details/weekly-timeline";
import { UpcomingTasks } from "@/components/course-details/upcoming-tasks";
import { Resources } from "@/components/course-details/resources";

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

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params.id as string;
  const mounted = useHydrated();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load course
  useEffect(() => {
    if (!mounted) return;

    let loadedCourse = getCourseById(courseId);
    if (!loadedCourse) {
      loadedCourse = getCourseDetails(courseId);
    }

    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        setCourse(loadedCourse);
        setIsLoading(false);
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [courseId, mounted]);

  // Save course to storage
  useEffect(() => {
    if (!course || !mounted) return;

    const timer = setTimeout(() => {
      saveCourseToStorage(course);
    }, 500);

    return () => clearTimeout(timer);
  }, [course, mounted]);

  const handleTaskComplete = (
    weekNumber: number,
    taskId: string,
    completed: boolean,
  ) => {
    if (!course) return;

    const updatedCourse = { ...course };
    const week = updatedCourse.weeklyPlan?.find(
      (w) => w.weekNumber === weekNumber,
    );
    if (week) {
      const task = week.studyTasks.find((t) => t.id === taskId);
      if (task) {
        task.completed = completed;
      }
    }

    setCourse(updatedCourse);
  };

  if (isLoading || !mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Course not found</h1>
          <p className="text-muted-foreground mt-4">
            The course you&apos;re looking for doesn&apos;t exist.
          </p>
        </Card>
      </div>
    );
  }

  const weeks = course.weeklyPlan || [];
  const allTasks = weeks.flatMap((w) => w.studyTasks);
  const allAssignments = weeks.flatMap((w) => w.assignments);
  const allExams = weeks.flatMap((w) => w.exams);

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-6 space-y-8">
        <CourseHeroCard course={course} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left/Main: Weekly Timeline */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Weekly Timeline
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  View all weeks and track your progress
                </p>
              </div>
              <WeeklyTimeline
                weeks={weeks}
                onTaskComplete={handleTaskComplete}
              />
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <UpcomingTasks
              tasks={allTasks}
              assignments={allAssignments}
              exams={allExams}
              onTaskComplete={(taskId, completed) => {
                if (!course) return;

                const updatedCourse = { ...course };
                for (const week of updatedCourse.weeklyPlan || []) {
                  const task = week.studyTasks.find((t) => t.id === taskId);
                  if (task) {
                    task.completed = completed;
                  }
                }

                setCourse(updatedCourse);
              }}
            />
            <Resources resources={course.resources} />
          </div>
        </div>
      </div>
    </div>
  );
}
