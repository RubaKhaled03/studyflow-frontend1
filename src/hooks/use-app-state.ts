"use client";

import { useState, useEffect, useCallback } from "react";
import { AppState, EMPTY_APP_STATE } from "@/types/app-state";
import { AppStore } from "@/lib/store/app-store";
import { PlannerSemester } from "@/types/academic-planning";
import { Course } from "@/types/course";
import { TaskItem } from "@/types/tasks";
import { LearningPlan } from "@/types/self-learning";
import { ReflectionEntry } from "@/types/reflections";
import { DataService } from "@/services/data.service";

// ─── Pure helper functions (outside hook, no dependency issues) ───────────────

function keepStreakAlive(state: AppState): AppState {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const lastActive = state.streak?.lastActiveDate || "";
  const activeDays = state.streak?.activeDays || [];
  const hasToday = activeDays.includes(today);
  const newActiveDays = hasToday ? activeDays : [...activeDays, today];

  if (lastActive === today && (state.streak?.currentCount || 0) > 0) {
    if (hasToday) return state;
    return { ...state, streak: { ...state.streak, activeDays: newActiveDays } };
  }

  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, "0")}-${String(yesterdayDate.getDate()).padStart(2, "0")}`;
  const currentCount = state.streak?.currentCount || 0;
  const longestCount = state.streak?.longestCount || 0;
  const newCount = lastActive === yesterday ? currentCount + 1 : 1;

  return {
    ...state,
    streak: {
      currentCount: newCount,
      longestCount: Math.max(longestCount, newCount),
      lastActiveDate: today,
      activeDays: newActiveDays,
    },
  };
}

function syncSemesterStatus(state: AppState, semesterId?: string): AppState {
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
        ),
      },
    };
  }
  if (!allCompleted && currentSemester?.status === "completed") {
    return {
      ...state,
      academicPlanning: {
        ...state.academicPlanning,
        semesters: state.academicPlanning.semesters.map(s =>
          s.id === semesterId ? { ...s, status: "current" } : s
        ),
      },
    };
  }
  return state;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppState() {
  const [state, setState] = useState<AppState>(EMPTY_APP_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("studyflow_auth_token");

    const unsubscribe = AppStore.subscribe((newState) => {
      setState(newState);
    });

    if (token) {
      const savedUser = localStorage.getItem("studyflow_user");
      if (savedUser) {
        AppStore.update({ userProfile: JSON.parse(savedUser) });
      }

      DataService.loadAllData()
        .then(({ courses, tasks, reflections, learningPlans, semesters }) => {
          AppStore.update((prev) => ({
            ...prev,
            courses,
            tasks,
            reflections,
            selfLearningPlans: learningPlans,
            academicPlanning: {
              ...prev.academicPlanning,
              semesters,
            },
          }));
        })
        .catch((err) => {
          console.error("Failed to load data from backend:", err);
        })
        .finally(() => {
          setState(AppStore.get());
          setIsLoaded(true);
        });
    } else {
      setTimeout(() => {
        setState(AppStore.get());
        setIsLoaded(true);
      }, 0);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const updateState = useCallback((update: Partial<AppState> | ((s: AppState) => AppState)) => {
    AppStore.update(update);
  }, []);

  const resetApp = useCallback(() => {
    AppStore.reset();
    setState(EMPTY_APP_STATE);
  }, []);

  // ─── Semesters ──────────────────────────────────────────────────────────────

  const addSemester = useCallback(async (semester: PlannerSemester) => {
    try {
      const saved = await DataService.createSemester(semester);
      AppStore.update(prev => keepStreakAlive({
        ...prev,
        academicPlanning: { ...prev.academicPlanning, semesters: [...prev.academicPlanning.semesters, saved] }
      }));
    } catch {
      AppStore.update(prev => keepStreakAlive({
        ...prev,
        academicPlanning: { ...prev.academicPlanning, semesters: [...prev.academicPlanning.semesters, semester] }
      }));
    }
  }, []);

  const updateSemester = useCallback(async (semester: PlannerSemester) => {
    try {
      const saved = await DataService.updateSemester(semester);
      AppStore.update(prev => keepStreakAlive({
        ...prev,
        academicPlanning: { ...prev.academicPlanning, semesters: prev.academicPlanning.semesters.map(s => s.id === saved.id ? saved : s) }
      }));
    } catch {
      AppStore.update(prev => keepStreakAlive({
        ...prev,
        academicPlanning: { ...prev.academicPlanning, semesters: prev.academicPlanning.semesters.map(s => s.id === semester.id ? semester : s) }
      }));
    }
  }, []);

  const deleteSemester = useCallback(async (id: string) => {
    try { await DataService.deleteSemester(id); } catch { console.error("Failed to delete semester"); }
    AppStore.update(prev => keepStreakAlive({
      ...prev,
      academicPlanning: { ...prev.academicPlanning, semesters: prev.academicPlanning.semesters.filter(s => s.id !== id) }
    }));
  }, []);

  // ─── Courses ────────────────────────────────────────────────────────────────

  const addCourse = useCallback(async (course: Course) => {
    try {
      const saved = await DataService.createCourse(course);
      AppStore.update(prev => keepStreakAlive(syncSemesterStatus({ ...prev, courses: [...prev.courses, saved] }, saved.semesterId)));
    } catch {
      AppStore.update(prev => keepStreakAlive(syncSemesterStatus({ ...prev, courses: [...prev.courses, course] }, course.semesterId)));
    }
  }, []);

  const updateCourse = useCallback(async (course: Course) => {
    try {
      const saved = await DataService.updateCourse(course);
      AppStore.update(prev => keepStreakAlive(syncSemesterStatus({ ...prev, courses: prev.courses.map(c => c.id === saved.id ? saved : c) }, saved.semesterId)));
    } catch {
      AppStore.update(prev => keepStreakAlive(syncSemesterStatus({ ...prev, courses: prev.courses.map(c => c.id === course.id ? course : c) }, course.semesterId)));
    }
  }, []);

  const deleteCourse = useCallback(async (id: string) => {
    try { await DataService.deleteCourse(id); } catch { console.error("Failed to delete course"); }
    AppStore.update(prev => {
      const course = prev.courses.find(c => c.id === id);
      return keepStreakAlive(syncSemesterStatus({ ...prev, courses: prev.courses.filter(c => c.id !== id) }, course?.semesterId));
    });
  }, []);

  // ─── Tasks ──────────────────────────────────────────────────────────────────

  const addTask = useCallback(async (task: TaskItem) => {
    try {
      const saved = await DataService.createTask(task);
      AppStore.update(prev => keepStreakAlive({ ...prev, tasks: [...prev.tasks, saved] }));
    } catch {
      AppStore.update(prev => keepStreakAlive({ ...prev, tasks: [...prev.tasks, task] }));
    }
  }, []);

  const updateTask = useCallback(async (task: TaskItem) => {
    try {
      const saved = await DataService.updateTask(task);
      AppStore.update(prev => keepStreakAlive({ ...prev, tasks: prev.tasks.map(t => t.id === saved.id ? saved : t) }));
    } catch {
      AppStore.update(prev => keepStreakAlive({ ...prev, tasks: prev.tasks.map(t => t.id === task.id ? task : t) }));
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try { await DataService.deleteTask(id); } catch { console.error("Failed to delete task"); }
    AppStore.update(prev => keepStreakAlive({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  }, []);

  // ─── Learning Plans ─────────────────────────────────────────────────────────

  const addLearningPlan = useCallback(async (plan: LearningPlan) => {
    try {
      const saved = await DataService.createLearningPlan(plan);
      AppStore.update(prev => keepStreakAlive({ ...prev, selfLearningPlans: [...prev.selfLearningPlans, saved] }));
    } catch {
      AppStore.update(prev => keepStreakAlive({ ...prev, selfLearningPlans: [...prev.selfLearningPlans, plan] }));
    }
  }, []);

  const updateLearningPlan = useCallback(async (plan: LearningPlan) => {
    try {
      const saved = await DataService.updateLearningPlan(plan);
      AppStore.update(prev => keepStreakAlive({ ...prev, selfLearningPlans: prev.selfLearningPlans.map(p => p.id === saved.id ? saved : p) }));
    } catch {
      AppStore.update(prev => keepStreakAlive({ ...prev, selfLearningPlans: prev.selfLearningPlans.map(p => p.id === plan.id ? plan : p) }));
    }
  }, []);

  const deleteLearningPlan = useCallback(async (id: string) => {
    try { await DataService.deleteLearningPlan(id); } catch { console.error("Failed to delete learning plan"); }
    AppStore.update(prev => keepStreakAlive({ ...prev, selfLearningPlans: prev.selfLearningPlans.filter(p => p.id !== id) }));
  }, []);

  // ─── Reflections ────────────────────────────────────────────────────────────

  const addReflection = useCallback(async (reflection: ReflectionEntry) => {
    try {
      const saved = await DataService.createReflection(reflection);
      AppStore.update(prev => keepStreakAlive({ ...prev, reflections: [saved, ...prev.reflections] }));
    } catch {
      AppStore.update(prev => keepStreakAlive({ ...prev, reflections: [reflection, ...prev.reflections] }));
    }
  }, []);

  // ─── Streak ─────────────────────────────────────────────────────────────────

  const updateStreak = useCallback(() => {
    AppStore.update(prev => keepStreakAlive(prev));
  }, []);

  // ─── Unified Task Save/Delete ────────────────────────────────────────────────

  const saveUnifiedTask = useCallback(async (task: TaskItem) => {
  // Tasks مرتبطة بـ self-learning — تحفظ في memory بس
  if (task.sourceModule === "self-learning" && task.linkedLearningPlanId) {
    AppStore.update(prev => ({
      ...prev,
      selfLearningPlans: prev.selfLearningPlans.map(plan => {
        if (plan.id !== task.linkedLearningPlanId) return plan;
        if (task.id.startsWith("milestone-")) {
          const mId = task.id.replace("milestone-", "");
          return { ...plan, milestones: plan.milestones.map(m => m.id === mId ? { ...m, title: task.title, description: task.description, targetDate: task.dueDate, completed: task.status === "done" } : m) };
        }
        if (task.id.startsWith("sl-task-")) {
          const tId = task.id.replace("sl-task-", "");
          return { ...plan, stages: plan.stages.map(stage => ({ ...stage, tasks: stage.tasks?.map(t => t.id === tId ? { ...t, title: task.title, dueDate: task.dueDate, time: task.dueTime, completed: task.status === "done" } : t) })) };
        }
        return plan;
      }),
    }));
    return;
  }

  // Tasks مرتبطة بـ course — تحفظ في memory بس
  if (task.sourceModule === "course" && task.linkedCourseId) {
    AppStore.update(prev => ({
      ...prev,
      courses: prev.courses.map(course => {
        if (course.id !== task.linkedCourseId) return course;
        if (task.id.startsWith("assign-")) {
          const aId = task.id.replace("assign-", "");
          return { ...course, assignments: course.assignments?.map(a => a.id === aId ? { ...a, title: task.title, description: task.description, dueDate: task.dueDate || a.dueDate, status: task.status === "done" ? "submitted_on_time" : "pending" } : a) };
        }
        if (task.id.startsWith("event-")) {
          const eId = task.id.replace("event-", "");
          return { ...course, academicEvents: course.academicEvents?.map(e => e.id === eId ? { ...e, title: task.title, date: task.dueDate || e.date } : e) as never };
        }
        return course;
      }),
    }));
    return;
  }

  // Tasks عادية — نحفظها على الباك
  const prefixes = ["milestone-", "sl-task-", "w-assign-", "w-exam-", "w-task-", "assign-", "event-", "w-item-"];
  if (prefixes.some(p => task.id.startsWith(p))) {
    AppStore.update(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === task.id ? task : t) }));
    return;
  }

  const existingTask = AppStore.get().tasks.find(t => t.id === task.id);
  if (existingTask) {
    // تعديل task موجودة
    try {
      const saved = await DataService.updateTask(task);
      AppStore.update(prev => keepStreakAlive({ ...prev, tasks: prev.tasks.map(t => t.id === saved.id ? saved : t) }));
    } catch {
      AppStore.update(prev => keepStreakAlive({ ...prev, tasks: prev.tasks.map(t => t.id === task.id ? task : t) }));
    }
  } else {
    // إضافة task جديدة
    try {
      const saved = await DataService.createTask(task);
      AppStore.update(prev => keepStreakAlive({ ...prev, tasks: [saved, ...prev.tasks] }));
    } catch {
      AppStore.update(prev => keepStreakAlive({ ...prev, tasks: [task, ...prev.tasks] }));
    }
  }
}, []);
 

  const deleteUnifiedTask = useCallback((task: TaskItem) => {
    AppStore.update(prev => {
      if (task.sourceModule === "self-learning" && task.linkedLearningPlanId) {
        return {
          ...prev,
          selfLearningPlans: prev.selfLearningPlans.map(plan => {
            if (plan.id !== task.linkedLearningPlanId) return plan;
            if (task.id.startsWith("milestone-")) {
              return { ...plan, milestones: plan.milestones.filter(m => m.id !== task.id.replace("milestone-", "")) };
            }
            if (task.id.startsWith("sl-task-")) {
              const tId = task.id.replace("sl-task-", "");
              return { ...plan, stages: plan.stages.map(stage => ({ ...stage, tasks: stage.tasks?.filter(t => t.id !== tId) })) };
            }
            return plan;
          }),
        };
      }
      if (task.sourceModule === "course" && task.linkedCourseId) {
        return {
          ...prev,
          courses: prev.courses.map(course => {
            if (course.id !== task.linkedCourseId) return course;
            if (task.id.startsWith("assign-")) return { ...course, assignments: course.assignments?.filter(a => a.id !== task.id.replace("assign-", "")) };
            if (task.id.startsWith("event-")) return { ...course, academicEvents: course.academicEvents?.filter(e => e.id !== task.id.replace("event-", "")) };
            return course;
          }),
        };
      }
      return { ...prev, tasks: prev.tasks.filter(t => t.id !== task.id) };
    });
  }, []);

  return {
    state,
    isLoaded,
    updateState,
    resetApp,
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
    saveUnifiedTask,
    deleteUnifiedTask,
    user: state.userProfile,
    courses: state.courses,
    tasks: state.tasks,
    selfLearningPlans: state.selfLearningPlans,
    reflections: state.reflections,
    streak: state.streak || { currentCount: 0, longestCount: 0, lastActiveDate: "", activeDays: [] },
  };
}