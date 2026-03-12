import { PlannerCourse } from "@/types/academic-planning";
import { isPassingGrade } from "./grading";

/**
 * Calculates the Cumulative Average (out of 100) for a given list of courses.
 * Only includes completed courses that have a numeric grade.
 * Average is weighted by credits: sum(credits * grade) / sum(credits).
 */
export function calculateCumulativeAverage(courses: PlannerCourse[]): number | null {
  let totalWeightedGrades = 0;
  let totalCreditsForAverage = 0;

  for (const course of courses) {
    if (course.status === "completed" && course.numericGrade !== null && course.numericGrade !== undefined) {
      totalWeightedGrades += course.numericGrade * course.credits;
      // Even failed courses count against the average, so their credits are added to the denominator
      totalCreditsForAverage += course.credits;
    }
  }

  // If no courses count toward the average, return null
  if (totalCreditsForAverage === 0) {
    return null;
  }

  return totalWeightedGrades / totalCreditsForAverage;
}

/**
 * Calculates total passed completed credits.
 * Only includes completed courses with a passing grade (>= 60).
 */
export function calculatePassedCompletedCredits(courses: PlannerCourse[]): number {
  return courses
    .filter(
      (c) =>
        c.status === "completed" &&
        c.numericGrade !== undefined &&
        c.numericGrade !== null &&
        isPassingGrade(c.numericGrade)
    )
    .reduce((sum, c) => sum + c.credits, 0);
}

/**
 * Calculates total failed completed credits.
 * Only includes completed courses with a failing grade (< 60).
 */
export function calculateFailedCompletedCredits(courses: PlannerCourse[]): number {
  return courses
    .filter(
      (c) =>
        c.status === "completed" &&
        c.numericGrade !== undefined &&
        c.numericGrade !== null &&
        !isPassingGrade(c.numericGrade)
    )
    .reduce((sum, c) => sum + c.credits, 0);
}

/**
 * Calculates credits for currently in-progress courses.
 */
export function calculateInProgressCredits(courses: PlannerCourse[]): number {
  return courses
    .filter((c) => c.status === "in-progress")
    .reduce((sum, c) => sum + c.credits, 0);
}

/**
 * Calculates credits for planned courses.
 */
export function calculatePlannedCredits(courses: PlannerCourse[]): number {
  return courses
    .filter((c) => c.status === "planned")
    .reduce((sum, c) => sum + c.credits, 0);
}

/**
 * Estimates remaining semesters based on remaining credits and the average passed credits per COMPLETED semester.
 *
 * @param remainingTargetCredits The number of credits remaining to graduate.
 * @param semestersCourses Array of arrays, where each inner array represents the courses in a completed semester.
 * @param defaultSemesterLoad Used if no usable semester history exists.
 */
export function estimateRemainingSemesters(
  remainingTargetCredits: number,
  semestersCourses: PlannerCourse[][],
  defaultSemesterLoad: number
): number {
  if (remainingTargetCredits <= 0) return 0;

  // We strictly use semesters that actually had *passed* credits
  let totalPassedFromSemesters = 0;
  let countUsableSemesters = 0;

  for (const semesterCourses of semestersCourses) {
    const passedCredits = calculatePassedCompletedCredits(semesterCourses);
    if (passedCredits > 0) {
      totalPassedFromSemesters += passedCredits;
      countUsableSemesters += 1;
    }
  }

  const avgCreditsPerSemester =
    countUsableSemesters > 0
      ? totalPassedFromSemesters / countUsableSemesters
      : defaultSemesterLoad;

  return remainingTargetCredits / avgCreditsPerSemester;
}
