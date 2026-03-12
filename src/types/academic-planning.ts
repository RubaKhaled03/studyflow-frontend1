export type PlannerSemesterStatus = 'planned' | 'in-progress' | 'completed';
export type PlannerCourseStatus = 'planned' | 'in-progress' | 'completed';

export interface PlannerCourse {
  id: string;
  semesterId: string;
  title: string;
  code?: string;
  credits: number;
  status: PlannerCourseStatus;
  numericGrade?: number | null; // Only meaningful if status === 'completed', 0-100
  notes?: string;
}

export interface PlannerSemester {
  id: string;
  name: string;
  status: PlannerSemesterStatus;
  notes?: string;
}

export interface AcademicPlannerConfig {
  totalRequiredCredits: number;
  defaultSemesterLoad: number;
  initialCompletedCredits?: number;
}
