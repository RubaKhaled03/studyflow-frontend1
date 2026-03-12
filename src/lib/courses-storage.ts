import { Course } from "@/types/course";
import { SEED_COURSES, getMockCourseDetails } from "./mock-course-details";

export const STORAGE_KEY = "studyflow-courses";

// Use SEED_COURSES which contains full detailed data
export const INITIAL_COURSES: Course[] = SEED_COURSES;

/**
 * Get all courses from localStorage, or return initial courses if localStorage is empty
 * This function works both on client and server, gracefully handling server-side calls
 * When a seed course is found in localStorage, it's merged with complete mock data to preserve details
 */
export function getCourses(): Course[] {
  if (typeof window === "undefined") return INITIAL_COURSES;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const courses = stored ? JSON.parse(stored) : INITIAL_COURSES;

    // Merge stored courses with seed course data to preserve detailed information
    return courses.map((course: Course) => {
      // For seed courses, merge with complete mock data
      const mockCourse = getMockCourseDetails(course.id);
      if (mockCourse) {
        // Keep user edits but fill in missing detailed fields from mock data
        return {
          ...mockCourse,
          ...course,
          // Preserve key user-editable fields
          id: course.id,
          status: course.status,
          progress:
            course.progress !== undefined
              ? course.progress
              : mockCourse.progress,
          finalGrade: course.finalGrade || mockCourse.finalGrade,
        };
      }
      return course;
    });
  } catch {
    return INITIAL_COURSES;
  }
}

/**
 * Find a course by ID, comparing both IDs as strings for safety
 * This handles both initial courses and newly added courses from localStorage
 * For seed courses, merges with complete mock data to ensure all details are available
 */
export function getCourseById(courseId: string | string[]): Course | null {
  const courses = getCourses();
  const id = Array.isArray(courseId) ? courseId[0] : courseId;

  const course = courses.find((c) => String(c.id) === String(id));
  return course || null;
}

/**
 * Save a course to localStorage
 * Updates the course if it exists, or adds it if it's new
 * For seed courses, only user modifications are stored (mock details are preserved via merge)
 */
export function saveCourseToStorage(course: Course): void {
  if (typeof window === "undefined") return;

  try {
    const courses = getCourses();
    const index = courses.findIndex((c) => String(c.id) === String(course.id));

    if (index >= 0) {
      courses[index] = course;
    } else {
      courses.push(course);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch (error) {
    console.error("Failed to save course:", error);
  }
}
