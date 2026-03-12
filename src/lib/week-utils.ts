import {
  Course,
  StudyTask,
  WeeklyPlan,
  Assignment,
  Exam,
  AcademicEvent,
  WeekItem,
  WeekItemType,
  ItemPriority,
} from "@/types/course";

/**
 * Generate an array of all weeks for a course based on durationWeeks
 * This is the source of truth for week structure
 */
export function generateWeeksStructure(durationWeeks: number): WeeklyPlan[] {
  return Array.from({ length: durationWeeks }, (_, i) => ({
    weekNumber: i + 1,
    title: `Week ${i + 1}`,
    completed: false,
    studyTasks: [],
    assignments: [],
    exams: [],
  }));
}

/**
 * Merge generated weeks with existing weeklyPlan data
 * This ensures all weeks exist while preserving task data
 */
export function reconcileWeeksWithData(
  durationWeeks: number,
  existingWeeklyPlan?: WeeklyPlan[],
): WeeklyPlan[] {
  const allWeeks = generateWeeksStructure(durationWeeks);

  if (!existingWeeklyPlan || existingWeeklyPlan.length === 0) {
    return allWeeks;
  }

  // Merge: keep existing data for weeks that have it
  return allWeeks.map((week) => {
    const existingWeek = existingWeeklyPlan.find(
      (w) => w.weekNumber === week.weekNumber,
    );
    return existingWeek ? { ...existingWeek } : week;
  });
}

/**
 * Check if a week has all tasks completed
 */
export function isWeekCompleted(week: WeeklyPlan): boolean {
  if (week.completed === true) return true;

  const taskListStudy = week.studyTasks;
  const taskListAssignments = week.assignments;

  // Combine all tasks
  const allTasksCompleted =
    taskListStudy.every((task) => task.completed) &&
    taskListAssignments.every((a) => a.status === "graded");

  if (
    taskListStudy.length === 0 &&
    taskListAssignments.length === 0 &&
    week.exams.length === 0
  ) {
    return false;
  }

  return allTasksCompleted;
}

/**
 * Calculate completion percentage for a specific week
 */
export function calculateWeekProgress(week: WeeklyPlan): {
  completed: number;
  total: number;
  percentage: number;
} {
  const total =
    week.studyTasks.length + week.assignments.length + week.exams.length;

  if (total === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  const completedStudyTasks = week.studyTasks.filter((t) => t.completed).length;
  const completedAssignments = week.assignments.filter(
    (a) => a.status === "graded",
  ).length;
  const completedExams = week.exams.length; // Exams are auto-complete

  const completed = completedStudyTasks + completedAssignments + completedExams;
  const percentage = Math.round((completed / total) * 100);

  return { completed, total, percentage };
}

/**
 * Calculate overall course progress based on all weeks
 */
export function calculateCourseProgress(weeks: WeeklyPlan[]): {
  percentage: number;
  completedWeeks: number;
  totalWeeks: number;
} {
  if (weeks.length === 0) {
    return { percentage: 0, completedWeeks: 0, totalWeeks: 0 };
  }

  const completedWeeks = weeks.filter(isWeekCompleted).length;
  const percentage = Math.round((completedWeeks / weeks.length) * 100);

  return {
    percentage,
    completedWeeks,
    totalWeeks: weeks.length,
  };
}

/**
 * Get count of different task types in a week
 */
export function getWeekTaskCounts(week: WeeklyPlan) {
  return {
    studyTasks: week.studyTasks.length,
    assignments: week.assignments.length,
    exams: week.exams.length,
    total: week.studyTasks.length + week.assignments.length + week.exams.length,
  };
}

/**
 * Get all upcoming tasks across all weeks, sorted by due date
 */
export function getUpcomingTasks(weeks: WeeklyPlan[]): Array<{
  weekNumber: number;
  task: StudyTask | Assignment | Exam;
  type: "study" | "assignment" | "exam";
}> {
  const tasks: Array<{
    weekNumber: number;
    task: StudyTask | Assignment | Exam;
    type: "study" | "assignment" | "exam";
  }> = [];

  weeks.forEach((week) => {
    week.studyTasks.forEach((task) => {
      if (!task.completed) {
        tasks.push({ weekNumber: week.weekNumber, task, type: "study" });
      }
    });

    week.assignments.forEach((assignment) => {
      if (assignment.status !== "graded") {
        tasks.push({
          weekNumber: week.weekNumber,
          task: assignment,
          type: "assignment",
        });
      }
    });

    week.exams.forEach((exam) => {
      tasks.push({ weekNumber: week.weekNumber, task: exam, type: "exam" });
    });
  });

  // Sort by due date
  return tasks.sort((a, b) => {
    let dateA = "";
    let dateB = "";

    if (a.type === "study") {
      dateA = (a.task as StudyTask).dueDate || "";
    } else if (a.type === "assignment") {
      dateA = (a.task as Assignment).dueDate;
    } else if (a.type === "exam") {
      dateA = (a.task as Exam).date;
    }

    if (b.type === "study") {
      dateB = (b.task as StudyTask).dueDate || "";
    } else if (b.type === "assignment") {
      dateB = (b.task as Assignment).dueDate;
    } else if (b.type === "exam") {
      dateB = (b.task as Exam).date;
    }

    return new Date(dateA).getTime() - new Date(dateB).getTime();
  });
}

/**
 * Create or update a task in a week
 * Returns updated course with merged weeklyPlan
 */
export function updateTaskInWeek(
  course: Course,
  weekNumber: number,
  taskType: "study" | "assignment" | "exam",
  taskId: string,
  updates: Partial<StudyTask>,
): Course {
  if (!course.weeklyPlan) {
    course.weeklyPlan = generateWeeksStructure(course.durationWeeks);
  }

  const updatedWeeklyPlan = [...course.weeklyPlan];
  const weekIndex = updatedWeeklyPlan.findIndex(
    (w) => w.weekNumber === weekNumber,
  );

  if (weekIndex === -1) return course;

  const week = { ...updatedWeeklyPlan[weekIndex] };

  if (taskType === "study") {
    const taskIndex = week.studyTasks.findIndex((t) => t.id === taskId);
    if (taskIndex >= 0) {
      week.studyTasks = [...week.studyTasks];
      week.studyTasks[taskIndex] = {
        ...week.studyTasks[taskIndex],
        ...updates,
      };
    }
  }

  updatedWeeklyPlan[weekIndex] = week;

  return {
    ...course,
    weeklyPlan: updatedWeeklyPlan,
  };
}

/**
 * Add a new task to a week
 * Ensures week exists and returns updated course
 */
export function addTaskToWeek(
  course: Course,
  weekNumber: number,
  task: StudyTask,
): Course {
  // Ensure weightlyPlan exists
  let weeklyPlan = course.weeklyPlan;
  if (!weeklyPlan) {
    weeklyPlan = generateWeeksStructure(course.durationWeeks);
  } else {
    weeklyPlan = [...weeklyPlan];
  }

  // Ensure week exists
  const weekIndex = weeklyPlan.findIndex((w) => w.weekNumber === weekNumber);
  if (weekIndex === -1) {
    weeklyPlan.push({
      weekNumber,
      title: `Week ${weekNumber}`,
      completed: false,
      studyTasks: [task],
      assignments: [],
      exams: [],
    });
  } else {
    const week = { ...weeklyPlan[weekIndex] };
    week.studyTasks = [...week.studyTasks, task];
    weeklyPlan[weekIndex] = week;
  }

  return {
    ...course,
    weeklyPlan,
  };
}

/**
 * Delete a task from a week
 */
export function deleteTaskFromWeek(
  course: Course,
  weekNumber: number,
  taskId: string,
  taskType: "study" | "assignment" | "exam",
): Course {
  if (!course.weeklyPlan) return course;

  const weeklyPlan = [...course.weeklyPlan];
  const weekIndex = weeklyPlan.findIndex((w) => w.weekNumber === weekNumber);

  if (weekIndex === -1) return course;

  const week = { ...weeklyPlan[weekIndex] };

  if (taskType === "study") {
    week.studyTasks = week.studyTasks.filter((t) => t.id !== taskId);
  } else if (taskType === "assignment") {
    week.assignments = week.assignments.filter((a) => a.id !== taskId);
  } else if (taskType === "exam") {
    week.exams = week.exams.filter((e) => e.id !== taskId);
  }

  weeklyPlan[weekIndex] = week;

  return {
    ...course,
    weeklyPlan,
  };
}

// ============================================================================
// ACADEMIC EVENTS MANAGEMENT
// ============================================================================

/**
 * Get all academic events sorted by date
 */
export function getUpcomingAcademicEvents(
  events: AcademicEvent[] | undefined,
): AcademicEvent[] {
  if (!events) return [];

  return [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });
}

/**
 * Get days until event
 */
export function getDaysUntilEvent(eventDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(eventDate);
  date.setHours(0, 0, 0, 0);

  const diff = date.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Check if event is today
 */
export function isEventToday(eventDate: string): boolean {
  return getDaysUntilEvent(eventDate) === 0;
}

/**
 * Check if event is tomorrow
 */
export function isEventTomorrow(eventDate: string): boolean {
  return getDaysUntilEvent(eventDate) === 1;
}

/**
 * Check if event is this week
 */
export function isEventThisWeek(eventDate: string): boolean {
  const days = getDaysUntilEvent(eventDate);
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSunday = 6 - dayOfWeek;

  return days >= 0 && days <= daysUntilSunday;
}

/**
 * Check if event is overdue
 */
export function isEventOverdue(eventDate: string, status: string): boolean {
  return getDaysUntilEvent(eventDate) < 0 && status === "upcoming";
}

/**
 * Get time label like "Today", "Tomorrow", "In 3 days"
 */
export function getEventTimeLabel(eventDate: string): string {
  const days = getDaysUntilEvent(eventDate);

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 1 && days <= 7) return `In ${days} days`;
  if (days < -1 && days >= -7) return `${Math.abs(days)} days ago`;

  const date = new Date(eventDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Add an academic event to course
 */
export function addAcademicEvent(course: Course, event: AcademicEvent): Course {
  const events = course.academicEvents ? [...course.academicEvents] : [];
  events.push(event);

  return {
    ...course,
    academicEvents: events,
  };
}

/**
 * Update an academic event
 */
export function updateAcademicEvent(
  course: Course,
  eventId: string,
  updates: Partial<AcademicEvent>,
): Course {
  if (!course.academicEvents) return course;

  const events = course.academicEvents.map((e) =>
    e.id === eventId ? { ...e, ...updates } : e,
  );

  return {
    ...course,
    academicEvents: events,
  };
}

/**
 * Delete an academic event
 */
export function deleteAcademicEvent(course: Course, eventId: string): Course {
  if (!course.academicEvents) return course;

  const events = course.academicEvents.filter((e) => e.id !== eventId);

  return {
    ...course,
    academicEvents: events,
  };
}

/**
 * Get events by status
 */
export function getEventsByStatus(
  events: AcademicEvent[] | undefined,
  status: string,
): AcademicEvent[] {
  if (!events) return [];
  return events.filter((e) => e.status === status);
}

/**
 * Get urgent events (upcoming and with urgent/important highlight)
 */
export function getUrgentEvents(
  events: AcademicEvent[] | undefined,
): AcademicEvent[] {
  if (!events) return [];

  return events
    .filter(
      (e) =>
        e.status === "upcoming" &&
        (e.highlightLevel === "urgent" || e.highlightLevel === "important"),
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * ============================================
 * UNIFIED WEEK ITEM MANAGEMENT
 * ============================================
 * These functions manage WeekItem objects that can represent any type
 * of academic work (tasks, quizzes, exams, assignments, etc.)
 */

/**
 * Get all items for a specific week, sorted by date and priority
 */
export function getWeekItems(week: WeeklyPlan | undefined): WeekItem[] {
  if (!week) return [];

  const items = week.items || [];

  // Sort by date, then by priority
  return items.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    if (dateA !== dateB) return dateA - dateB;

    // Priority order: urgent > important > normal > low
    const priorityOrder: Record<ItemPriority, number> = {
      urgent: 0,
      important: 1,
      normal: 2,
      low: 3,
    };

    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Get urgent/important items in a week
 */
export function getUrgentWeekItems(week: WeeklyPlan | undefined): WeekItem[] {
  if (!week) return [];

  return getWeekItems(week).filter(
    (item) => item.priority === "urgent" || item.priority === "important",
  );
}

/**
 * Get items of a specific type in a week
 */
export function getItemsByType(
  week: WeeklyPlan | undefined,
  type: WeekItemType,
): WeekItem[] {
  if (!week) return [];

  return getWeekItems(week).filter((item) => item.type === type);
}

/**
 * Add a new item to a week
 */
export function addWeekItem(week: WeeklyPlan, item: WeekItem): WeeklyPlan {
  return {
    ...week,
    items: [...(week.items || []), item],
  };
}

/**
 * Update an item in a week
 */
export function updateWeekItem(
  week: WeeklyPlan,
  itemId: string,
  updates: Partial<WeekItem>,
): WeeklyPlan {
  return {
    ...week,
    items: (week.items || []).map((item) =>
      item.id === itemId ? { ...item, ...updates } : item,
    ),
  };
}

/**
 * Delete an item from a week
 */
export function deleteWeekItem(week: WeeklyPlan, itemId: string): WeeklyPlan {
  return {
    ...week,
    items: (week.items || []).filter((item) => item.id !== itemId),
  };
}

/**
 * Toggle completion status of an item
 */
export function toggleWeekItemCompletion(
  week: WeeklyPlan,
  itemId: string,
): WeeklyPlan {
  return {
    ...week,
    items: (week.items || []).map((item) =>
      item.id === itemId
        ? {
            ...item,
            completed: !item.completed,
            status: !item.completed ? "completed" : "upcoming",
          }
        : item,
    ),
  };
}

/**
 * Toggle submission status of an item
 */
export function toggleWeekItemSubmission(
  week: WeeklyPlan,
  itemId: string,
): WeeklyPlan {
  return {
    ...week,
    items: (week.items || []).map((item) =>
      item.id === itemId
        ? {
            ...item,
            submitted: !item.submitted,
            status: !item.submitted ? "submitted" : "upcoming",
          }
        : item,
    ),
  };
}

/**
 * Calculate week progress including unified items
 */
export function calculateWeekProgressWithItems(week: WeeklyPlan): {
  completed: number;
  total: number;
  percentage: number;
} {
  const items = getWeekItems(week);

  if (items.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  const completed = items.filter(
    (item) =>
      item.completed ||
      item.submitted ||
      item.status === "completed" ||
      item.status === "submitted",
  ).length;

  const percentage = Math.round((completed / items.length) * 100);

  return {
    completed,
    total: items.length,
    percentage,
  };
}

/**
 * Get item icon and color based on type
 */
export function getItemTypeInfo(type: WeekItemType): {
  icon: string;
  color: string;
  label: string;
} {
  const typeInfo: Record<
    WeekItemType,
    { icon: string; color: string; label: string }
  > = {
    study_task: { icon: "📚", color: "blue", label: "Study Task" },
    midterm: { icon: "📊", color: "purple", label: "Midterm" },
    final: { icon: "🏁", color: "red", label: "Final Exam" },
    quiz: { icon: "✅", color: "green", label: "Quiz" },
    assignment: { icon: "📋", color: "orange", label: "Assignment" },
    project: { icon: "🎯", color: "cyan", label: "Project" },
    presentation: { icon: "🎤", color: "pink", label: "Presentation" },
    lab: { icon: "🧪", color: "indigo", label: "Lab" },
    submission: { icon: "📤", color: "teal", label: "Submission" },
    reading_session: { icon: "📖", color: "amber", label: "Reading" },
  };

  return typeInfo[type] || typeInfo.study_task;
}

/**
 * Get priority color for UI
 */
export function getPriorityColor(priority: ItemPriority): string {
  switch (priority) {
    case "urgent":
      return "red";
    case "important":
      return "amber";
    case "normal":
      return "blue";
    case "low":
      return "gray";
    default:
      return "gray";
  }
}

/**
 * Get smart date label for an item
 */
export function getItemDateLabel(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0) return "Overdue";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Check if item is overdue
 */
export function isWeekItemOverdue(item: WeekItem): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(item.date);
  date.setHours(0, 0, 0, 0);

  return (
    date < today && item.status !== "completed" && item.status !== "submitted"
  );
}

// ============================================================================
// NEW: ASSIGNMENT AND EXAM MANAGEMENT FOR ENHANCED WEEKLY ITEMS
// ============================================================================

/**
 * Add an assignment to a week
 */
export function addAssignmentToWeek(
  course: Course,
  weekNumber: number,
  assignment: Assignment,
): Course {
  let weeklyPlan = course.weeklyPlan;
  if (!weeklyPlan) {
    weeklyPlan = generateWeeksStructure(course.durationWeeks);
  } else {
    weeklyPlan = [...weeklyPlan];
  }

  const weekIndex = weeklyPlan.findIndex((w) => w.weekNumber === weekNumber);
  if (weekIndex === -1) {
    weeklyPlan.push({
      weekNumber,
      title: `Week ${weekNumber}`,
      completed: false,
      studyTasks: [],
      assignments: [assignment],
      exams: [],
    });
  } else {
    const week = { ...weeklyPlan[weekIndex] };
    week.assignments = [...week.assignments, assignment];
    weeklyPlan[weekIndex] = week;
  }

  return {
    ...course,
    weeklyPlan,
  };
}

/**
 * Add an exam/quiz to a week
 */
export function addExamToWeek(
  course: Course,
  weekNumber: number,
  exam: Exam,
): Course {
  let weeklyPlan = course.weeklyPlan;
  if (!weeklyPlan) {
    weeklyPlan = generateWeeksStructure(course.durationWeeks);
  } else {
    weeklyPlan = [...weeklyPlan];
  }

  const weekIndex = weeklyPlan.findIndex((w) => w.weekNumber === weekNumber);
  if (weekIndex === -1) {
    weeklyPlan.push({
      weekNumber,
      title: `Week ${weekNumber}`,
      completed: false,
      studyTasks: [],
      assignments: [],
      exams: [exam],
    });
  } else {
    const week = { ...weeklyPlan[weekIndex] };
    week.exams = [...week.exams, exam];
    weeklyPlan[weekIndex] = week;
  }

  return {
    ...course,
    weeklyPlan,
  };
}

/**
 * Add any type of item (task, assignment, or exam) to a week
 */
export function addItemToWeek(
  course: Course,
  weekNumber: number,
  item: StudyTask | Assignment | Exam,
  itemType: "task" | "assignment" | "exam" | "quiz",
): Course {
  if (itemType === "task") {
    return addTaskToWeek(course, weekNumber, item as StudyTask);
  } else if (itemType === "assignment") {
    return addAssignmentToWeek(course, weekNumber, item as Assignment);
  } else if (itemType === "exam" || itemType === "quiz") {
    return addExamToWeek(course, weekNumber, item as Exam);
  }
  return course;
}

/**
 * Update an assignment in a week
 */
export function updateAssignmentInWeek(
  course: Course,
  weekNumber: number,
  assignmentId: string,
  updates: Partial<Assignment>,
): Course {
  if (!course.weeklyPlan) {
    course.weeklyPlan = generateWeeksStructure(course.durationWeeks);
  }

  const updatedWeeklyPlan = [...course.weeklyPlan];
  const weekIndex = updatedWeeklyPlan.findIndex(
    (w) => w.weekNumber === weekNumber,
  );

  if (weekIndex === -1) return course;

  const week = { ...updatedWeeklyPlan[weekIndex] };
  const assignmentIndex = week.assignments.findIndex(
    (a) => a.id === assignmentId,
  );

  if (assignmentIndex >= 0) {
    week.assignments = [...week.assignments];
    week.assignments[assignmentIndex] = {
      ...week.assignments[assignmentIndex],
      ...updates,
    };
  }

  updatedWeeklyPlan[weekIndex] = week;

  return {
    ...course,
    weeklyPlan: updatedWeeklyPlan,
  };
}

/**
 * Update an exam in a week
 */
export function updateExamInWeek(
  course: Course,
  weekNumber: number,
  examId: string,
  updates: Partial<Exam>,
): Course {
  if (!course.weeklyPlan) {
    course.weeklyPlan = generateWeeksStructure(course.durationWeeks);
  }

  const updatedWeeklyPlan = [...course.weeklyPlan];
  const weekIndex = updatedWeeklyPlan.findIndex(
    (w) => w.weekNumber === weekNumber,
  );

  if (weekIndex === -1) return course;

  const week = { ...updatedWeeklyPlan[weekIndex] };
  const examIndex = week.exams.findIndex((e) => e.id === examId);

  if (examIndex >= 0) {
    week.exams = [...week.exams];
    week.exams[examIndex] = {
      ...week.exams[examIndex],
      ...updates,
    };
  }

  updatedWeeklyPlan[weekIndex] = week;

  return {
    ...course,
    weeklyPlan: updatedWeeklyPlan,
  };
}

/**
 * Update an assignment submission status
 */
export function toggleAssignmentSubmission(
  course: Course,
  weekNumber: number,
  assignmentId: string,
): Course {
  if (!course.weeklyPlan) return course;

  const updatedWeeklyPlan = [...course.weeklyPlan];
  const weekIndex = updatedWeeklyPlan.findIndex(
    (w) => w.weekNumber === weekNumber,
  );

  if (weekIndex === -1) return course;

  const week = { ...updatedWeeklyPlan[weekIndex] };
  const assignmentIndex = week.assignments.findIndex(
    (a) => a.id === assignmentId,
  );

  if (assignmentIndex >= 0) {
    week.assignments = [...week.assignments];
    const assignment = week.assignments[assignmentIndex];
    week.assignments[assignmentIndex] = {
      ...assignment,
      status: assignment.status === "submitted" ? "pending" : "submitted",
    };
  }

  updatedWeeklyPlan[weekIndex] = week;

  return {
    ...course,
    weeklyPlan: updatedWeeklyPlan,
  };
}
