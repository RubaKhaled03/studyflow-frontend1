import { Course } from "@/types/course";

/**
 * Fall back to detailed mock data for seed courses
 * This is now used primarily to build the INITIAL_COURSES array and for demo mode seeding
 */
export function getMockCourseDetails(courseId: string): Course | null {
  const mockCourses: Record<string, Course> = {
    "1": {
      id: "1",
      title: "Advanced Calculus",
      instructor: "Dr. Sarah Jenkins",
      credits: 3,
      semester: "Fall 2025",
      status: "current",
      imageUrl: "/courses/calculus.png",
      durationWeeks: 13,
      currentWeek: 6,
      code: "MATH201",
      progress: 65,
      description:
        "Advanced study of calculus including multivariable functions, integration techniques, and applications to real-world problems.",
      weeklyPlan: [
        {
          weekNumber: 1,
          title: "Introduction & Review",
          studyTasks: [
            { id: "1-1", title: "Review calculus basics", completed: true },
            { id: "1-2", title: "Read Chapter 1", completed: true },
          ],
          assignments: [
            {
              id: "1-a1",
              title: "Problem Set 1",
              description: "Solve problems 1-15 from Chapter 1",
              dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
              status: "submitted",
            },
          ],
          exams: [],
        },
        {
          weekNumber: 2,
          title: "Limits and Continuity",
          studyTasks: [
            {
              id: "2-1",
              title: "Understand limit definition",
              completed: true,
            },
            { id: "2-2", title: "Practice limit problems", completed: true },
          ],
          assignments: [
            {
              id: "2-a1",
              title: "Problem Set 2",
              dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
              status: "graded",
            },
          ],
          exams: [],
        },
        {
          weekNumber: 3,
          title: "Derivatives",
          studyTasks: [
            { id: "3-1", title: "Learn derivative rules", completed: false },
            { id: "3-2", title: "Practice differentiation", completed: false },
          ],
          assignments: [],
          exams: [],
        },
        {
          weekNumber: 4,
          title: "Applications of Derivatives",
          studyTasks: [
            {
              id: "4-1",
              title: "Read Chapter 4",
              completed: false,
            },
          ],
          assignments: [],
          exams: [
            {
              id: "4-e1",
              title: "Quiz 1",
              date: new Date(Date.now() + 86400000 * 20).toISOString(),
              time: "14:00",
              duration: 50,
              location: "Room 201",
            },
          ],
        },
        {
          weekNumber: 5,
          title: "Integration Techniques",
          studyTasks: [
            { id: "5-1", title: "Learn integration methods", completed: false },
          ],
          assignments: [],
          exams: [],
        },
        {
          weekNumber: 6,
          title: "Word Problems and Applications",
          studyTasks: [
            {
              id: "6-1",
              title: "Complete practice problems",
              completed: false,
            },
          ],
          assignments: [
            {
              id: "6-a1",
              title: "Assignment 3",
              dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
              status: "pending",
            },
          ],
          exams: [],
        },
      ],
      upcomingTasks: [
        { id: "up1", title: "Complete Problem Set 3", completed: false },
        {
          id: "up2",
          title: "Read Chapter 5",
          completed: false,
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        },
      ],
      assignments: [
        {
          id: "a1",
          title: "Problem Set 3",
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          status: "pending",
        },
        {
          id: "a2",
          title: "Midterm Project",
          dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
          status: "pending",
        },
      ],
      exams: [
        {
          id: "e1",
          title: "Quiz 1",
          date: new Date(Date.now() + 86400000 * 5).toISOString(),
          time: "14:00",
          duration: 50,
          location: "Room 201",
        },
        {
          id: "e2",
          title: "Midterm Exam",
          date: new Date(Date.now() + 86400000 * 20).toISOString(),
          time: "09:00",
          duration: 120,
          location: "Hall A",
        },
      ],
      resources: [
        {
          id: "r1",
          title: "Calculus Textbook (PDF)",
          type: "pdf",
          url: "#",
          description: "Official course textbook - Chapters 1-7",
        },
        {
          id: "r2",
          title: "MIT OpenCourseWare - Calculus I",
          type: "video",
          url: "#",
          description: "Video lectures and practice problems",
        },
        {
          id: "r3",
          title: "Desmos Graphing Calculator",
          type: "link",
          url: "#",
          description: "Interactive graphing tool for visualization",
        },
        {
          id: "r4",
          title: "Lecture Notes - Week 6",
          type: "document",
          url: "#",
          description: "Handwritten notes from class",
        },
      ],
    },
    "2": {
      id: "2",
      title: "Data Structures",
      instructor: "Prof. Michael Chen",
      credits: 4,
      semester: "Fall 2025",
      status: "current",
      imageUrl: "/courses/Data-Structures.png",
      durationWeeks: 14,
      currentWeek: 5,
      code: "CS301",
      progress: 45,
      description: "Study of fundamental data structures and algorithms.",
      weeklyPlan: [],
      upcomingTasks: [],
      resources: [],
    },
    "3": {
      id: "3",
      title: "Linear Algebra",
      instructor: "Dr. Emily Rodriguez",
      credits: 3,
      semester: "Spring 2025",
      status: "completed",
      imageUrl: "/courses/Data-Structures.png",
      durationWeeks: 13,
      code: "MATH101",
      finalGrade: "92 (A)",
      description: "Study of vectors, matrices, and linear transformations.",
      weeklyPlan: [],
      upcomingTasks: [],
      resources: [],
    },
    "4": {
      id: "4",
      title: "Quantum Physics",
      instructor: "Prof. James Wilson",
      credits: 4,
      semester: "Spring 2026",
      status: "planned",
      imageUrl: "/courses/Data-Structures.png",
      durationWeeks: 15,
      code: "PHYS401",
      description: "Introduction to quantum mechanics and its applications.",
      weeklyPlan: [],
      upcomingTasks: [],
      resources: [],
    },
  };

  return mockCourses[courseId] || null;
}

// Complete seed courses with all detailed data
export const SEED_COURSES: Course[] = Object.values({
    "1": getMockCourseDetails("1"),
    "2": getMockCourseDetails("2"),
    "3": getMockCourseDetails("3"),
    "4": getMockCourseDetails("4"),
}).filter(c => c !== null) as Course[];
