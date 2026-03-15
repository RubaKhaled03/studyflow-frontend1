"use client";

import { useState, useEffect } from "react";
import { AppState, EMPTY_APP_STATE } from "@/types/app-state";
import { AppStore } from "@/lib/store/app-store";
import { PlannerSemester } from "@/types/academic-planning";
import { Course } from "@/types/course";

/**
 * Hook to consume and update the centralized AppState.
 * Handles hydration safety by only accessing localStorage after mount.
 */
export function useAppState() {
  const [state, setState] = useState<AppState>(EMPTY_APP_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial load and subscription
  useEffect(() => {
    // Sync with the latest store state immediately
    setState(AppStore.get());
    setIsLoaded(true);

    // Subscribe to changes in THIS window
    const unsubscribe = AppStore.subscribe((newState) => {
      setState(newState);
    });

    // Listen for changes from OTHER tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "studyflow_app_state" && e.newValue) {
        setState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  /**
   * Updates state and persists to storage.
   * Listeners (including this one) will be notified automatically.
   */
  const updateState = (update: Partial<AppState> | ((s: AppState) => AppState)) => {
    AppStore.update(update);
  };

  /**
   * Resets the entire app to empty
   */
  const resetApp = () => {
    AppStore.reset();
    setState(EMPTY_APP_STATE);
  };

  /**
   * Loads the demo data seeder
   */
  const loadDemoData = async () => {
    const { DEMO_APP_STATE } = await import("@/lib/store/demo-seed");
    AppStore.set(DEMO_APP_STATE);
    setState(DEMO_APP_STATE);
  };

  /**
   * Semesters
   */
  const addSemester = (semester: PlannerSemester) => {
    updateState(prev => ({
      ...prev,
      academicPlanning: {
        ...prev.academicPlanning,
        semesters: [...prev.academicPlanning.semesters, semester]
      }
    }));
  };

  const updateSemester = (semester: PlannerSemester) => {
    updateState(prev => ({
      ...prev,
      academicPlanning: {
        ...prev.academicPlanning,
        semesters: prev.academicPlanning.semesters.map(s => s.id === semester.id ? semester : s)
      }
    }));
  };

  const deleteSemester = (id: string) => {
    updateState(prev => ({
      ...prev,
      academicPlanning: {
        ...prev.academicPlanning,
        semesters: prev.academicPlanning.semesters.filter(s => s.id !== id)
      }
    }));
  };

  /**
   * Courses
   */
  const addCourse = (course: Course) => {
    updateState(prev => ({
      ...prev,
      academicPlanning: course.semesterId && 
      course.semesterId !== "prior-completed" && 
      !prev.academicPlanning.semesters.some(s => s.id === course.semesterId)
        ? {
            ...prev.academicPlanning,
            semesters: [
              ...prev.academicPlanning.semesters,
              {
                id: course.semesterId,
                name: "New Semester",
                status: "planned",
                weeksCount: 16,
                academicYear: new Date().getFullYear().toString(),
              },
            ],
          }
        : prev.academicPlanning,
      courses: [...prev.courses, course]
    }));
  };

  const updateCourse = (course: Course) => {
    updateState(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === course.id ? course : c)
    }));
  };

  const deleteCourse = (id: string) => {
    updateState(prev => ({
      ...prev,
      courses: prev.courses.filter(c => c.id !== id)
    }));
  };

  return {
    state,
    isLoaded,
    updateState,
    resetApp,
    loadDemoData,
    addSemester,
    updateSemester,
    deleteSemester,
    addCourse,
    updateCourse,
    deleteCourse,
    // Add quick access to nested properties
    user: state.userProfile,
    courses: state.courses,
    tasks: state.tasks,
  };
}
