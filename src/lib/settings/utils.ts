import { UserProfile } from "@/types/settings";

const STORAGE_KEY = "studyflow_user_data";

export const getDefaultProfile = (): UserProfile => ({
  id: "user-1",
  name: "",
  university: "",
  major: "",
  academicYear: "",
  currentGPA: "",
  totalCreditHours: "",
  completedCreditHours: "",
  onboardingCompleted: false,
  focusPreferences: {
    preferredSessionDuration: 25,
    preferredBreakDuration: 5,
    autoStartBreak: false,
    defaultFocusMode: "pomodoro",
  },
  reminderPreferences: {
    remindersEnabled: true,
    defaultReminderTiming: 15,
    defaultReminderUnit: "minutes",
    emailNotificationsEnabled: false,
    inAppNotificationsEnabled: true,
  },
  themePreference: "system",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const loadProfile = (): UserProfile => {
  if (typeof window === "undefined") return getDefaultProfile();
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return getDefaultProfile();
  
  try {
    const profile = JSON.parse(storedData);
    // Merge with defaults to ensure all fields exist
    return {
      ...getDefaultProfile(),
      ...profile,
      // Ensure nested objects are also merged
      focusPreferences: {
        ...getDefaultProfile().focusPreferences,
        ...(profile.focusPreferences || {}),
      },
      reminderPreferences: {
        ...getDefaultProfile().reminderPreferences,
        ...(profile.reminderPreferences || {}),
      },
    };
  } catch (error) {
    console.error("Error loading profile:", error);
    return getDefaultProfile();
  }
};

export const saveProfile = (profile: UserProfile): void => {
  if (typeof window === "undefined") return;
  
  const updatedProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
};
