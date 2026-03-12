export type CourseStatus = "current" | "completed" | "planned";

// Item types that can appear in a week
export type WeekItemType =
  | "study_task"
  | "midterm"
  | "final"
  | "quiz"
  | "assignment"
  | "project"
  | "presentation"
  | "lab"
  | "submission"
  | "reading_session";

export type ItemStatus =
  | "upcoming"
  | "completed"
  | "submitted"
  | "missed"
  | "graded";

export type ItemPriority = "low" | "normal" | "important" | "urgent";

// Unified week item that can represent any type of academic work
export interface WeekItem {
  id: string;
  title: string;
  type: WeekItemType;
  weekNumber: number;
  date: string; // ISO date string YYYY-MM-DD
  time?: string; // HH:MM format
  endTime?: string; // HH:MM format
  description?: string;
  status: ItemStatus;
  priority: ItemPriority;
  location?: string; // for exams or in-person events
  isAllDay?: boolean;
  completed?: boolean; // for tasks
  submitted?: boolean; // for assignments/submissions
}

// Legacy types preserved for backward compatibility
export type EventType =
  | "midterm"
  | "final"
  | "quiz"
  | "assignment"
  | "project"
  | "presentation"
  | "lab";

export type EventStatus = "upcoming" | "completed" | "missed";

export type HighlightLevel = "normal" | "important" | "urgent";

export interface AcademicEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time?: string;
  endTime?: string;
  description?: string;
  status: EventStatus;
  highlightLevel: HighlightLevel;
  deadline?: string;
  location?: string;
  isAllDay?: boolean;
}

export interface StudyTask {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
}

export interface Exam {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  location?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video" | "link" | "document" | "image";
  url: string;
  description?: string;
}

export interface WeeklyPlan {
  weekNumber: number;
  title: string;
  completed?: boolean;
  studyTasks: StudyTask[];
  assignments: Assignment[];
  exams: Exam[];
  items?: WeekItem[]; // Unified items structure
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  credits: number;
  semester: string;
  status: CourseStatus;
  imageUrl: string;
  durationWeeks: number; // Required: duration in weeks
  currentWeek?: number; // Current week number (1-durationWeeks)
  code?: string; // Optional: course code
  description?: string; // Optional: course description/notes
  startDate?: string; // Optional: ISO date string
  endDate?: string; // Optional: ISO date string
  progress?: number; // 0-100, only for current courses
  finalGrade?: string; // e.g., "92 (A)", only for completed courses
  weeklyPlan?: WeeklyPlan[]; // Weekly breakdown of course
  upcomingTasks?: StudyTask[]; // Upcoming tasks for this course
  assignments?: Assignment[]; // All assignments for this course
  exams?: Exam[]; // All exams for this course
  resources?: Resource[]; // Course resources
  academicEvents?: AcademicEvent[]; // Important deadlines and events
}
