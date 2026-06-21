import { AppState, EMPTY_APP_STATE } from "@/types/app-state";

export class AppStore {
  private static currentState: AppState = EMPTY_APP_STATE;
  private static isClient = typeof window !== "undefined";
  private static listeners: ((state: AppState) => void)[] = [];

  /**
   * Tracks whether data has already been fetched from the backend
   * during this browser session, so we only call loadAllData() once
   * instead of on every page navigation / component remount.
   */
  private static hasLoadedFromBackend = false;

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
    return this.currentState;
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
      
      this.currentState = newState;
      
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
    this.hasLoadedFromBackend = false;
    this.set(EMPTY_APP_STATE);
  }

  /**
   * Clear all studyflow related localStorage keys to ensure absolute clean start
   */
  static clearAll(): void {
    this.hasLoadedFromBackend = false;
    this.set(EMPTY_APP_STATE);
  }

  /**
   * Whether loadAllData() has already run successfully this session.
   */
  static hasLoaded(): boolean {
    return this.hasLoadedFromBackend;
  }

  /**
   * Mark the backend data as loaded so subsequent mounts skip refetching.
   */
  static markLoaded(): void {
    this.hasLoadedFromBackend = true;
  }

  /**
   * Explicit migration logic - MUST be triggered manually now
   */
  static performExplicitMigration(): void {
    // Migration logic removed as localStorage is no longer used
  }
}