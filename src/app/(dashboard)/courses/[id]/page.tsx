"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useAppState } from "@/hooks/use-app-state";
import { Course, StudyTask, Assignment, Exam, Resource, WeeklyPlan } from "@/types/course";
import { HeaderSkeleton, ListSkeleton } from "@/components/shared/skeletons";
import { Card } from "@/components/ui/card";
import { CourseHeroCard } from "@/components/course-details/course-hero-card";
import { WeeklyTimeline } from "@/components/course-details/weekly-timeline";
import { UpcomingTasks } from "@/components/course-details/upcoming-tasks";
import { Resources } from "@/components/course-details/resources";

type ItemType = "study-task" | "assignment" | "quiz" | "exam";



export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { isLoaded, courses, updateCourse } = useAppState();

  const course = courses.find(c => c.id === courseId) || null;

  // Derived: Ensure we have a full weekly list matching durationWeeks
  const getFullWeeklyPlan = (course: Course): WeeklyPlan[] => {
    const totalWeeks = course.durationWeeks || 0;
    const existingWeeks = course.weeklyPlan || [];
    
    return Array.from({ length: totalWeeks }, (_, i) => {
      const weekNumber = i + 1;
      const existingWeek = existingWeeks.find(w => w.weekNumber === weekNumber);
      return existingWeek || {
        weekNumber,
        title: `Week ${weekNumber} Content`,
        studyTasks: [],
        assignments: [],
        exams: [],
        completed: false
      };
    });
  };

  // Handler: toggle study task completion
  const handleTaskComplete = (weekNumber: number, taskId: string, completed: boolean) => {
    if (!course) return;
    
    const fullPlan = getFullWeeklyPlan(course);
    const updatedWeeklyPlan = fullPlan.map((w: WeeklyPlan) => {
      if (w.weekNumber !== weekNumber) return w;
      
      const newStudyTasks = w.studyTasks.map((t: StudyTask) => t.id === taskId ? { ...t, completed } : t);
      const allTasksDone = newStudyTasks.length > 0 && newStudyTasks.every(t => t.completed);
      
      // Auto-complete the week if all tasks are done
      let newWeekCompleted = w.completed;
      if (allTasksDone && !w.completed) {
        newWeekCompleted = true;
      } else if (!allTasksDone && w.completed) {
        newWeekCompleted = false; // Mark uncompleted if a task is unchecked
      }

      return { 
        ...w, 
        studyTasks: newStudyTasks,
        completed: newWeekCompleted
      };
    });

    const completedCount = updatedWeeklyPlan.filter(w => w.completed).length;
    const progress = Math.round((completedCount / updatedWeeklyPlan.length) * 100);

    updateCourse({
      ...course,
      weeklyPlan: updatedWeeklyPlan,
      progress
    });
  };

  // Handler: add item to a week
  const handleAddItem = (weekNumber: number, type: ItemType, item: StudyTask | Assignment | Exam) => {
    if (!course) return;

    const fullPlan = getFullWeeklyPlan(course);
    const updatedWeeklyPlan = fullPlan.map(w => {
      if (w.weekNumber !== weekNumber) return w;
      if (type === "study-task")
        return { ...w, studyTasks: [...w.studyTasks, item as StudyTask] };
      if (type === "assignment" || type === "quiz")
        return { ...w, assignments: [...w.assignments, item as Assignment] };
      if (type === "exam")
        return { ...w, exams: [...w.exams, item as Exam] };
      return w;
    });

    updateCourse({
      ...course,
      weeklyPlan: updatedWeeklyPlan
    });
  };

  // Handler: toggle week complete mark
  const handleWeekComplete = (weekNumber: number) => {
    if (!course) return;
    
    const fullPlan = getFullWeeklyPlan(course);
    const updatedWeeklyPlan = fullPlan.map(w => {
      if (w.weekNumber !== weekNumber) return w;
      
      // Toggle completion status
      const newState = !w.completed;
      
      // If marking as completed, optionally mark all tasks as completed too
      const newStudyTasks = newState 
        ? w.studyTasks.map(t => ({...t, completed: true}))
        : w.studyTasks;
        
      return {
        ...w,
        completed: newState,
        studyTasks: newStudyTasks
      };
    });
    
    const completedCount = updatedWeeklyPlan.filter(w => w.completed).length;
    const progress = Math.round((completedCount / updatedWeeklyPlan.length) * 100);

    updateCourse({
      ...course,
      weeklyPlan: updatedWeeklyPlan,
      progress
    });
  };

  // Handler: update assignment status
  const handleAssignmentStatusChange = (weekNumber: number, assignmentId: string, newStatus: Assignment["status"]) => {
    if (!course) return;

    const fullPlan = getFullWeeklyPlan(course);
    const updatedWeeklyPlan = fullPlan.map(w => {
      if (w.weekNumber !== weekNumber) return w;

      const newAssignments = w.assignments.map(a => 
        a.id === assignmentId ? { ...a, status: newStatus } : a
      );

      return {
        ...w,
        assignments: newAssignments
      };
    });

    updateCourse({
      ...course,
      weeklyPlan: updatedWeeklyPlan
    });
  };

  // Handler: resource changes (add/delete)
  const handleResourcesChange = (resources: Resource[]) => {
    if (!course) return;
    updateCourse({ ...course, resources });
  };

  if (!course || !isLoaded) {
    return (
      <div className="space-y-6">
        <HeaderSkeleton />
        <ListSkeleton count={4} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Course not found</h1>
          <p className="text-muted-foreground mt-4">The course you&apos;re looking for doesn&apos;t exist.</p>
        </Card>
      </div>
    );
  }

  const weeks = getFullWeeklyPlan(course);
  const allTasks = weeks.flatMap((w) => w.studyTasks);
  const allAssignments = weeks.flatMap((w) => w.assignments);
  const allExams = weeks.flatMap((w) => w.exams);
  
  const completedWeeks = weeks.filter(w => w.completed).length;
  const progress = weeks.length > 0 ? Math.round((completedWeeks / weeks.length) * 100) : 0;
  const derivedCourse = { ...course, progress, currentWeek: completedWeeks };

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-6 space-y-8">
        <CourseHeroCard course={derivedCourse} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left/Main: Weekly Timeline */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Weekly Timeline</h2>
                <p className="text-slate-600 dark:text-slate-400">View all weeks and track your progress</p>
              </div>
              <WeeklyTimeline
                weeks={weeks}
                courseId={courseId}
                onTaskComplete={handleTaskComplete}
                onAddItem={handleAddItem}
                onWeekComplete={handleWeekComplete}
                onAssignmentStatusChange={handleAssignmentStatusChange}
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
                for (const w of weeks) {
                  const task = w.studyTasks.find((t: StudyTask) => t.id === taskId);
                  if (task) { handleTaskComplete(w.weekNumber, taskId, completed); return; }
                }
              }}
            />
            <Resources
              resources={course.resources}
              onResourcesChange={handleResourcesChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
