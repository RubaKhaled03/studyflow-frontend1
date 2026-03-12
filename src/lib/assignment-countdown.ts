/**
 * Assignment Countdown Utility
 * Calculates remaining time until assignment deadline
 */

export type CountdownState =
  | { type: "overdue"; daysOverdue: number }
  | { type: "due-today" }
  | { type: "due-tomorrow" }
  | { type: "due-soon"; daysLeft: number; hoursLeft?: number }
  | { type: "due-later"; daysLeft: number }
  | { type: "invalid" };

export interface CountdownDisplay {
  state: CountdownState;
  label: string;
  color: "red" | "orange" | "amber" | "blue" | "gray";
  icon: "alert" | "clock" | "calendar" | "check";
}

/**
 * Calculate countdown state based on deadline date and optional time
 */
export function calculateCountdown(
  deadlineDate: string,
  deadlineTime?: string,
): CountdownDisplay {
  try {
    const now = new Date();
    const deadline = new Date(deadlineDate);

    // Add time if provided
    if (deadlineTime) {
      const [hours, minutes] = deadlineTime.split(":").map(Number);
      deadline.setHours(hours, minutes, 0, 0);
    } else {
      // If no time specified, assume end of day (23:59:59)
      deadline.setHours(23, 59, 59, 999);
    }

    const diffMs = deadline.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    // Overdue
    if (diffMs < 0) {
      const daysOverdue = Math.abs(diffDays);
      return {
        state: { type: "overdue", daysOverdue },
        label:
          daysOverdue === 1 ? "Overdue 1 day" : `Overdue ${daysOverdue} days`,
        color: "red",
        icon: "alert",
      };
    }

    // Due today
    if (diffDays === 0) {
      return {
        state: { type: "due-today" },
        label: diffHours > 0 ? `${diffHours}h left` : "Due soon",
        color: "red",
        icon: "clock",
      };
    }

    // Due tomorrow
    if (diffDays === 1) {
      return {
        state: { type: "due-tomorrow" },
        label: "Due tomorrow",
        color: "orange",
        icon: "calendar",
      };
    }

    // Due in 2-7 days
    if (diffDays <= 7) {
      return {
        state: { type: "due-soon", daysLeft: diffDays, hoursLeft: diffHours },
        label: `${diffDays}d left`,
        color: "amber",
        icon: "calendar",
      };
    }

    // Due later
    return {
      state: { type: "due-later", daysLeft: diffDays },
      label: `${diffDays}d left`,
      color: "blue",
      icon: "calendar",
    };
  } catch {
    return {
      state: { type: "invalid" },
      label: "Invalid date",
      color: "gray",
      icon: "check",
    };
  }
}

/**
 * Format a date for display
 */
export function formatDeadlineDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Get color tailwind classes based on countdown state
 */
export function getCountdownColor(state: CountdownState): string {
  switch (state.type) {
    case "overdue":
      return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
    case "due-today":
      return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";
    case "due-tomorrow":
      return "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800";
    case "due-soon":
      return "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800";
    case "due-later":
      return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800";
    default:
      return "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800";
  }
}

/**
 * Get text color classes based on countdown state
 */
export function getCountdownTextColor(state: CountdownState): string {
  switch (state.type) {
    case "overdue":
      return "text-red-700 dark:text-red-300";
    case "due-today":
      return "text-red-700 dark:text-red-300";
    case "due-tomorrow":
      return "text-orange-700 dark:text-orange-300";
    case "due-soon":
      return "text-amber-700 dark:text-amber-300";
    case "due-later":
      return "text-blue-700 dark:text-blue-300";
    default:
      return "text-gray-700 dark:text-gray-300";
  }
}
