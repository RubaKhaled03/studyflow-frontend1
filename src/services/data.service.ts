import { apiClient } from "@/lib/api-client";
import { Course } from "@/types/course";
import { TaskItem } from "@/types/tasks";
import { ReflectionEntry } from "@/types/reflections";
import { LearningPlan } from "@/types/self-learning";
import { PlannerSemester } from "@/types/academic-planning";

export interface FocusSession {
  id: string;
  durationMinutes: number;
  startTime: string;
  endTime?: string | null;
  mode: "pomodoro" | "stopwatch";
  completed: boolean;
  linkedTaskId?: string | null;
  linkedCourseId?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FocusAnalytics {
  totalSessions: number;
  totalMinutesAllTime: number;
  weekly: {
    totalSessions: number;
    totalMinutes: number;
    dailyBreakdown: { date: string; minutes: number }[];
  };
  monthly: {
    totalSessions: number;
    totalMinutes: number;
  };
  averageSessionMinutes: number;
}

/**
 * Data service — all API calls for app data
 */
export const DataService = {

  // ─── COURSES ──────────────────────────────────────────────
  async getCourses(): Promise<Course[]> {
    return apiClient.get<Course[]>("/courses");
  },
  async createCourse(course: Omit<Course, "id">): Promise<Course> {
    return apiClient.post<Course>("/courses", course);
  },
  async updateCourse(course: Course): Promise<Course> {
    return apiClient.put<Course>(`/courses/${course.id}`, course);
  },
  async deleteCourse(id: string): Promise<void> {
    return apiClient.delete(`/courses/${id}`);
  },

  // ─── TASKS ────────────────────────────────────────────────
  async getTasks(): Promise<TaskItem[]> {
    return apiClient.get<TaskItem[]>("/tasks");
  },
  async createTask(task: Omit<TaskItem, "id">): Promise<TaskItem> {
    return apiClient.post<TaskItem>("/tasks", task);
  },
  async updateTask(task: TaskItem): Promise<TaskItem> {
    return apiClient.put<TaskItem>(`/tasks/${task.id}`, task);
  },
  async deleteTask(id: string): Promise<void> {
    return apiClient.delete(`/tasks/${id}`);
  },

  // ─── REFLECTIONS ──────────────────────────────────────────
  async getReflections(): Promise<ReflectionEntry[]> {
    return apiClient.get<ReflectionEntry[]>("/reflections");
  },
  async createReflection(reflection: Omit<ReflectionEntry, "id">): Promise<ReflectionEntry> {
    return apiClient.post<ReflectionEntry>("/reflections", reflection);
  },
  async updateReflection(reflection: ReflectionEntry): Promise<ReflectionEntry> {
    return apiClient.put<ReflectionEntry>(`/reflections/${reflection.id}`, reflection);
  },
  async deleteReflection(id: string): Promise<void> {
    return apiClient.delete(`/reflections/${id}`);
  },

  // ─── LEARNING PLANS ───────────────────────────────────────
  async getLearningPlans(): Promise<LearningPlan[]> {
    return apiClient.get<LearningPlan[]>("/self-learning");
  },
  async createLearningPlan(plan: Omit<LearningPlan, "id">): Promise<LearningPlan> {
    return apiClient.post<LearningPlan>("/self-learning", plan);
  },
  async updateLearningPlan(plan: LearningPlan): Promise<LearningPlan> {
    return apiClient.patch<LearningPlan>(`/self-learning/${plan.id}`, plan);
  },
  async deleteLearningPlan(id: string): Promise<void> {
    return apiClient.delete(`/self-learning/${id}`);
  },

  // ─── SEMESTERS ────────────────────────────────────────────
  async getSemesters(): Promise<PlannerSemester[]> {
    return apiClient.get<PlannerSemester[]>("/semesters");
  },
  async createSemester(semester: Omit<PlannerSemester, "id">): Promise<PlannerSemester> {
    return apiClient.post<PlannerSemester>("/semesters", semester);
  },
  async updateSemester(semester: PlannerSemester): Promise<PlannerSemester> {
    return apiClient.put<PlannerSemester>(`/semesters/${semester.id}`, semester);
  },
  async deleteSemester(id: string): Promise<void> {
    return apiClient.delete(`/semesters/${id}`);
  },

  // ─── FOCUS SESSIONS ───────────────────────────────────────
  async getFocusSessions(): Promise<FocusSession[]> {
    return apiClient.get<FocusSession[]>("/focus/sessions");
  },
  async createFocusSession(session: {
    durationMinutes: number;
    startTime: string;
    endTime?: string;
    mode: "pomodoro" | "stopwatch";
    completed?: boolean;
    linkedTaskId?: string;
    linkedCourseId?: string;
    notes?: string;
  }): Promise<FocusSession> {
    return apiClient.post<FocusSession>("/focus/sessions", session);
  },
  async deleteFocusSession(id: string): Promise<void> {
    return apiClient.delete(`/focus/sessions/${id}`);
  },
  async getFocusAnalytics(): Promise<FocusAnalytics> {
    return apiClient.get<FocusAnalytics>("/focus/analytics");
  },

  // ─── LOAD ALL DATA ────────────────────────────────────────
  async loadAllData() {
    const [courses, tasks, reflections, learningPlans, semesters] = await Promise.all([
      DataService.getCourses().catch(() => []),
      DataService.getTasks().catch(() => []),
      DataService.getReflections().catch(() => []),
      DataService.getLearningPlans().catch(() => []),
      DataService.getSemesters().catch(() => []),
    ]);
    return { courses, tasks, reflections, learningPlans, semesters };
  },
};