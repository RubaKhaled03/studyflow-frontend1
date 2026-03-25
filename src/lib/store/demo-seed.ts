import { AppState } from "@/types/app-state";
import { SEED_COURSES } from "../mock-course-details";

export const DEMO_APP_STATE: AppState = {
  userProfile: {
    id: "demo-user",
    name: "Alaa Eliwa",
    university: "Islamic University of Gaza",
    major: "Software Engineering",
    academicYear: "4th Year",
    currentGPA: "3.85",
    totalCreditHours: "144",
    completedCreditHours: "120",
    onboardingCompleted: true,
    avatarUrl: "",
    focusPreferences: {
      preferredSessionDuration: 25,
      preferredBreakDuration: 5,
      autoStartBreak: true,
      defaultFocusMode: "pomodoro",
    },
    reminderPreferences: {
      remindersEnabled: true,
      defaultReminderTiming: 15,
      defaultReminderUnit: "minutes",
      emailNotificationsEnabled: true,
      inAppNotificationsEnabled: true,
    },
    themePreference: "dark",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  onboardingCompleted: true,
  courses: SEED_COURSES.map(c => {
    // Add missing planning fields to seed courses
    if (c.id === "c1") return { ...c, semesterId: "sem-1" };
    if (c.id === "c2") return { ...c, semesterId: "sem-1" };
    return c;
  }),
  tasks: [
    {
      id: "demo-task-1",
      title: "Complete SRS Document",
      type: "assignment",
      priority: "high",
      status: "todo",
      sourceModule: "course",
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      dueTime: "23:59",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "demo-task-2",
      title: "Review Midterm Feedback",
      type: "study-task",
      priority: "medium",
      status: "todo",
      sourceModule: "course",
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
        id: "demo-task-3",
        title: "Buy graduation gown",
        type: "general",
        priority: "low",
        status: "done",
        sourceModule: "general",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
  ],
  academicPlanning: {
    semesters: [
      { id: "sem-1", name: "Fall 2025", status: "current", weeksCount: 16, academicYear: "2025/2026" },
      { id: "sem-2", name: "Spring 2025", status: "completed", weeksCount: 16, academicYear: "2024/2025" },
    ],
    config: {
      totalRequiredCredits: 144,
      defaultSemesterLoad: 15,
    },
  },
  selfLearningPlans: [
    {
      id: "plan-1",
      title: "Full-Stack Web Development",
      category: "Tech",
      status: "active",
      goal: "Become a professional full-stack developer",

      stages: [],
      resources: [],
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000 * 60).toISOString(),
      milestones: [
        { id: "m1", planId: "plan-1", title: "Learn React Hooks", completed: true, createdAt: new Date().toISOString() },
        { id: "m2", planId: "plan-1", title: "Build a Portfolio", completed: false, createdAt: new Date().toISOString(), reminderConfig: { enabled: true, timingValue: 1, timingUnit: "days" } },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  reflections: [
    {
      id: "ref-1",
      date: new Date().toISOString(),
      mood: "excellent",
      title: "Good progress today",
      achieved: "Understood multivariable integration",
      difficult: "Visualizing 3D surfaces",
      learned: "Integration techniques",
      improveNext: "Practice more problems",
      tags: ["calculus", "breakthrough"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  notifications: [
    {
      id: "demo-nt-1",
      title: "Welcome to StudyFlow!",
      message: "We're glad to have you here. This is a demo notification.",
      type: "system",
      read: false,
      createdAt: new Date().toISOString(),
      targetRoute: "/dashboard",
    },
    {
      id: "demo-nt-2",
      title: "Task Reminder",
      message: "Finish your study session for Advanced Calculus.",
      type: "reminder",
      read: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      targetRoute: "/dashboard",
    }
  ],
  streak: {
    currentCount: 3,
    longestCount: 5,
    lastActiveDate: new Date().toISOString().split('T')[0],
    activeDays: [
      new Date().toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0],
      new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    ]
  },
  demoMode: true,
  lastUpdated: new Date().toISOString(),
};
