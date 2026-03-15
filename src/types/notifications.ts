export type NotificationType = 
  | "task" 
  | "course" 
  | "exam" 
  | "assignment" 
  | "reflection" 
  | "system" 
  | "reminder";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  targetRoute: string; // The URL to navigate to or internal path
  targetId?: string;   // Optional ID for the item (e.g. task ID)
}
