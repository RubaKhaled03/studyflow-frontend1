import { AppState, EMPTY_APP_STATE } from "@/types/app-state";

const APP_STATE_KEY = "studyflow_app_state";

export class AppStore {
  private static isClient = typeof window !== "undefined";
  private static listeners: ((state: AppState) => void)[] = [];

  /**
   * Subscribe to state changes
   */
  static subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Safe getter for the entire app state
   */
  static get(): AppState {
    if (!this.isClient) return EMPTY_APP_STATE;

    try {
      const stored = localStorage.getItem(APP_STATE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      return EMPTY_APP_STATE;
    } catch (error) {
      console.error("Failed to load AppStore state", error);
      return EMPTY_APP_STATE;
    }
  }

  /**
   * Save the entire state and notify listeners
   */
  static set(state: AppState): void {
    if (!this.isClient) return;
    try {
      const newState = {
        ...state,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(APP_STATE_KEY, JSON.stringify(newState));
      
      // Notify all active listeners in this window
      this.listeners.forEach(listener => listener(newState));
    } catch (error) {
      console.error("Failed to save AppStore state", error);
    }
  }

  /**
   * Update specific parts of the state
   */
  static update(update: Partial<AppState> | ((state: AppState) => AppState)): void {
    const currentState = this.get();
    const newState = typeof update === "function" ? update(currentState) : { ...currentState, ...update };
    this.set(newState);
  }

  /**
   * Reset to empty initial state
   */
  static reset(): void {
    this.set(EMPTY_APP_STATE);
  }

  /**
   * Clear all studyflow related localStorage keys to ensure absolute clean start
   */
  static clearAll(): void {
    if (!this.isClient) return;
    const legacyKeys = [
      "studyflow_tasks", "studyflow-courses", "studyflow_planner_semesters",
      "studyflow_planner_courses", "studyflow_planner_config", 
      "studyflow_reflections", "studyflow_learning_plans", "studyflow_user_data"
    ];
    legacyKeys.forEach(key => localStorage.removeItem(key));
    localStorage.removeItem(APP_STATE_KEY);
  }

  /**
   * Explicit migration logic - MUST be triggered manually now
   */
  static performExplicitMigration(): void {
    if (!this.isClient) return;

    const newState = { ...EMPTY_APP_STATE };

    try {
      const userData = localStorage.getItem("studyflow_user_data");
      if (userData) newState.userProfile = JSON.parse(userData);

      const taskData = localStorage.getItem("studyflow_tasks");
      if (taskData) newState.tasks = JSON.parse(taskData);

      const courseData = localStorage.getItem("studyflow-courses");
      if (courseData) newState.courses = JSON.parse(courseData);

      const plannerSemesters = localStorage.getItem("studyflow_planner_semesters");
      const plannerCourses = localStorage.getItem("studyflow_planner_courses");
      const plannerConfig = localStorage.getItem("studyflow_planner_config");
      
      if (plannerSemesters) newState.academicPlanning.semesters = JSON.parse(plannerSemesters);
      if (plannerCourses) newState.academicPlanning.courses = JSON.parse(plannerCourses);
      if (plannerConfig) newState.academicPlanning.config = JSON.parse(plannerConfig);

      const reflectionData = localStorage.getItem("studyflow_reflections");
      if (reflectionData) newState.reflections = JSON.parse(reflectionData);

      const learningPlans = localStorage.getItem("studyflow_learning_plans");
      if (learningPlans) newState.selfLearningPlans = JSON.parse(learningPlans);

      this.set(newState);
      console.log("Legacy data migration completed successfully.");
    } catch (e) {
      console.error("Migration failed", e);
    }
  }
}
