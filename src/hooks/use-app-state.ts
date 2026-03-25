"use client";

import { useState, useEffect, useCallback } from "react";
import { AppState, EMPTY_APP_STATE } from "@/types/app-state";
import { AppStore } from "@/lib/store/app-store";
import { PlannerSemester } from "@/types/academic-planning";
import { Course } from "@/types/course";
import { TaskItem } from "@/types/tasks";
import { LearningPlan } from "@/types/self-learning";
import { ReflectionEntry } from "@/types/reflections";

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
  const updateState = useCallback((update: Partial<AppState> | ((s: AppState) => AppState)) => {
    AppStore.update(update);
  }, []);

  /**
   * Resets the entire app to empty
   */
  const resetApp = useCallback(() => {
    AppStore.reset();
    setState(EMPTY_APP_STATE);
  }, []);

  const loadDemoData = useCallback(async () => {
    const { DEMO_APP_STATE } = await import("@/lib/store/demo-seed");
    AppStore.set(DEMO_APP_STATE);
    setState(DEMO_APP_STATE);
  }, []);

  /**
   * Semesters
   */
  const addSemester = useCallback((semester: PlannerSemester) => {
    updateState(prev => {
      const newState = {
        ...prev,
        academicPlanning: {
          ...prev.academicPlanning,
          semesters: [...prev.academicPlanning.semesters, semester]
        }
      };
      return keepStreakAlive(newState);
    });
  }, []);

  const updateSemester = useCallback((semester: PlannerSemester) => {
    updateState(prev => {
      const newState = {
        ...prev,
        academicPlanning: {
          ...prev.academicPlanning,
          semesters: prev.academicPlanning.semesters.map(s => s.id === semester.id ? semester : s)
        }
      };
      return keepStreakAlive(newState);
    });
  }, []);

  const deleteSemester = useCallback((id: string) => {
    updateState(prev => {
      const newState = {
        ...prev,
        academicPlanning: {
          ...prev.academicPlanning,
          semesters: prev.academicPlanning.semesters.filter(s => s.id !== id)
        }
      };
      return keepStreakAlive(newState);
    });
  }, []);

  /**
   * Courses
   */
  const addCourse = useCallback((course: Course) => {
    updateState(prev => {
      const newState = {
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
                  status: "planned" as "planned" | "current" | "completed",
                  weeksCount: 16,
                  academicYear: new Date().getFullYear().toString(),
                },
              ],
            }
          : prev.academicPlanning,
        courses: [...prev.courses, course]
      };
      const newStateWithSync = syncSemesterStatus(newState, course.semesterId);
      return keepStreakAlive(newStateWithSync);
    });
  }, []);

  const updateCourse = useCallback((course: Course) => {
    updateState(prev => {
      const newState = {
        ...prev,
        courses: prev.courses.map(c => c.id === course.id ? course : c)
      };
      
      // Check old semester if it changed (though UI hide it now)
      const oldCourse = prev.courses.find(c => c.id === course.id);
      let finalState = syncSemesterStatus(newState, course.semesterId);
      if (oldCourse?.semesterId && oldCourse.semesterId !== course.semesterId) {
        finalState = syncSemesterStatus(finalState, oldCourse.semesterId);
      }
      return keepStreakAlive(finalState);
    });
  }, []);

  const deleteCourse = useCallback((id: string) => {
    updateState(prev => {
      const course = prev.courses.find(c => c.id === id);
      const newState = {
        ...prev,
        courses: prev.courses.filter(c => c.id !== id)
      };
      const finalState = syncSemesterStatus(newState, course?.semesterId);
      return keepStreakAlive(finalState);
    });
  }, []);

  /**
   * Tasks
   */
  const addTask = useCallback((task: TaskItem) => {
    updateState(prev => keepStreakAlive({ ...prev, tasks: [...prev.tasks, task] }));
  }, []);

  const updateTask = useCallback((task: TaskItem) => {
    updateState(prev => keepStreakAlive({
      ...prev,
      tasks: prev.tasks.map(t => t.id === task.id ? task : t)
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    updateState(prev => keepStreakAlive({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  }, []);

  /**
   * Learning Plans
   */
  const addLearningPlan = useCallback((plan: LearningPlan) => {
    updateState(prev => keepStreakAlive({ ...prev, selfLearningPlans: [...prev.selfLearningPlans, plan] }));
  }, []);

  const updateLearningPlan = useCallback((plan: LearningPlan) => {
    updateState(prev => keepStreakAlive({
      ...prev,
      selfLearningPlans: prev.selfLearningPlans.map(p => p.id === plan.id ? plan : p)
    }));
  }, []);

  const deleteLearningPlan = useCallback((id: string) => {
    updateState(prev => keepStreakAlive({
      ...prev,
      selfLearningPlans: prev.selfLearningPlans.filter(p => p.id !== id)
    }));
  }, []);

  /**
   * Reflections
   */
  const addReflection = useCallback((reflection: ReflectionEntry) => {
    updateState(prev => keepStreakAlive({ ...prev, reflections: [reflection, ...prev.reflections] }));
  }, []);

  /**
   * Helper to sync semester status based on courses
   */
  const syncSemesterStatus = (state: AppState, semesterId?: string): AppState => {
    if (!semesterId || semesterId === "prior-completed") return state;
    
    const semesterCourses = state.courses.filter(c => c.semesterId === semesterId);
    if (semesterCourses.length === 0) return state;

    const allCompleted = semesterCourses.every(c => c.status === "completed");
    const currentSemester = state.academicPlanning.semesters.find(s => s.id === semesterId);
    
    if (allCompleted && currentSemester?.status !== "completed") {
      return {
        ...state,
        academicPlanning: {
          ...state.academicPlanning,
          semesters: state.academicPlanning.semesters.map(s => 
            s.id === semesterId ? { ...s, status: "completed" } : s
          )
        }
      };
    } 
    
    // If not all completed but it's marked as completed, move back to current
    if (!allCompleted && currentSemester?.status === "completed") {
      return {
        ...state,
        academicPlanning: {
          ...state.academicPlanning,
          semesters: state.academicPlanning.semesters.map(s => 
            s.id === semesterId ? { ...s, status: "current" } : s
          )
        }
      };
    }

    return state;
  };

  /**
   * Streak Management
   */
  const updateStreak = useCallback(() => {
    updateState(prev => keepStreakAlive(prev));
  }, []);

  /**
   * Helper to keep streak alive
   */
  const keepStreakAlive = (state: AppState): AppState => {
    const now = new Date();
    // Normalize to YYYY-MM-DD in local time
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const lastActive = state.streak?.lastActiveDate || "";
    const activeDays = state.streak?.activeDays || [];
    
    // Ensure today is in activeDays
    const hasToday = activeDays.includes(today);
    const newActiveDays = hasToday ? activeDays : [...activeDays, today];
    
    // If already active today, just ensure activeDays is updated
    if (lastActive === today && (state.streak?.currentCount || 0) > 0) {
      if (hasToday) return state;
      return {
        ...state,
        streak: {
          ...state.streak,
          activeDays: newActiveDays,
        }
      };
    }
    
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`;
    
    const currentCount = state.streak?.currentCount || 0;
    const longestCount = state.streak?.longestCount || 0;
    
    let newCount = 1;
    if (lastActive === yesterday) {
      newCount = currentCount + 1;
    }
    
    const newLongest = Math.max(longestCount, newCount);
    
    return {
      ...state,
      streak: {
        currentCount: newCount,
        longestCount: newLongest,
        lastActiveDate: today,
        activeDays: newActiveDays,
      }
    };
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
    addTask,
    updateTask,
    deleteTask,
    addLearningPlan,
    updateLearningPlan,
    deleteLearningPlan,
    addReflection,
    updateStreak,
    // Add quick access to nested properties
    user: state.userProfile,
    courses: state.courses,
    tasks: state.tasks,
    streak: state.streak || { 
      currentCount: 0, 
      longestCount: 0, 
      lastActiveDate: "", 
      activeDays: [] 
    },
  };
}
