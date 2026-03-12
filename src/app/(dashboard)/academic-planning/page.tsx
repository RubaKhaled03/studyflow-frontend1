"use client";

import { useState, useEffect } from "react";
import { PlannerSemester, PlannerCourse, AcademicPlannerConfig } from "@/types/academic-planning";
import { AcademicOverviewCards } from "@/components/academic-planning/academic-overview-cards";
import { SemesterCard } from "@/components/academic-planning/semester-card";
import { EmptyState } from "@/components/academic-planning/empty-state";
import { AddSemesterDialog } from "@/components/academic-planning/add-semester-dialog";
import { AddCourseDialog } from "@/components/academic-planning/add-course-dialog";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, RefreshCcw } from "lucide-react";
import { 
  calculateCumulativeAverage, 
  calculatePassedCompletedCredits, 
  calculatePlannedCredits, 
  calculateInProgressCredits,
  estimateRemainingSemesters
} from "@/lib/academic-planning/utils";

// Default config if not provided from a backend
const DEFAULT_CONFIG: AcademicPlannerConfig = {
  totalRequiredCredits: 144, // Default typical requirement
  defaultSemesterLoad: 15,
};

export default function AcademicPlanning() {
  const [config, setConfig] = useState<AcademicPlannerConfig>(DEFAULT_CONFIG);
  const [semesters, setSemesters] = useState<PlannerSemester[]>([]);
  const [courses, setCourses] = useState<PlannerCourse[]>([]);
  
  // Hydration marker
  const [isLoaded, setIsLoaded] = useState(false);

  // Dialog states
  const [semesterDialogOpen, setSemesterDialogOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<PlannerSemester | null>(null);

  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [activeSemesterIdForCourse, setActiveSemesterIdForCourse] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<PlannerCourse | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedSemesters = localStorage.getItem("studyflow_planner_semesters");
      const savedCourses = localStorage.getItem("studyflow_planner_courses");
      const savedConfig = localStorage.getItem("studyflow_planner_config");

      if (savedSemesters) setSemesters(JSON.parse(savedSemesters));
      if (savedCourses) setCourses(JSON.parse(savedCourses));
      if (savedConfig) setConfig(JSON.parse(savedConfig));
    } catch (e) {
      console.error("Failed to parse planner data from local storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("studyflow_planner_semesters", JSON.stringify(semesters));
      localStorage.setItem("studyflow_planner_courses", JSON.stringify(courses));
      localStorage.setItem("studyflow_planner_config", JSON.stringify(config));
    }
  }, [semesters, courses, config, isLoaded]);

  // Derived calculations
  const cumulativeAverage = calculateCumulativeAverage(courses);
  const passedCredits = calculatePassedCompletedCredits(courses);
  const plannedCredits = calculatePlannedCredits(courses);
  const inProgressCredits = calculateInProgressCredits(courses);

  // Group courses by semester for easier mapping and calculations
  const coursesBySemesterId = semesters.map(s => {
    return courses.filter(c => c.semesterId === s.id);
  });
  
  const estimatedSemestersLeft = estimateRemainingSemesters(
      config.totalRequiredCredits - passedCredits,
      coursesBySemesterId,
      config.defaultSemesterLoad
  );

  // --- Handlers ---
  const handleAddSemesterClick = () => {
    setEditingSemester(null);
    setSemesterDialogOpen(true);
  };

  const handleEditSemesterClick = (semester: PlannerSemester) => {
    setEditingSemester(semester);
    setSemesterDialogOpen(true);
  };

  const handleSaveSemester = (semester: PlannerSemester) => {
    setSemesters(prev => {
      const idx = prev.findIndex(s => s.id === semester.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = semester;
        return next;
      }
      return [...prev, semester];
    });
  };

  const handleDeleteSemester = (id: string) => {
    if (confirm("Are you sure you want to delete this semester and all its courses?")) {
      setSemesters(prev => prev.filter(s => s.id !== id));
      setCourses(prev => prev.filter(c => c.semesterId !== id));
    }
  };

  const handleAddCourseClick = (semesterId: string) => {
    setEditingCourse(null);
    setActiveSemesterIdForCourse(semesterId);
    setCourseDialogOpen(true);
  };

  const handleEditCourseClick = (course: PlannerCourse) => {
    setEditingCourse(course);
    setActiveSemesterIdForCourse(course.semesterId);
    setCourseDialogOpen(true);
  };

  const handleSaveCourse = (course: PlannerCourse) => {
    setCourses(prev => {
      const idx = prev.findIndex(c => c.id === course.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = course;
        return next;
      }
      return [...prev, course];
    });
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
       setCourses(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleResetPlanner = () => {
      if (confirm("Are you sure you want to reset your entire planner? This cannot be undone.")) {
          setSemesters([]);
          setCourses([]);
      }
  }

  if (!isLoaded) {
    return null; // or a spinner. Avoids hydration mismatch
  }

  return (
    <div className="space-y-8 pb-12 w-full max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Academic Progress / Graduation Planner</h1>
          <p className="text-muted-foreground text-lg">
            Track your cumulative average, passing credit hours, and plan future semesters to stay on target for graduation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Button variant="outline" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground">
             <Settings2 className="mr-2 h-4 w-4" /> Required Hours: {config.totalRequiredCredits}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleResetPlanner} className="hidden sm:flex text-muted-foreground hover:text-red-600 hover:bg-red-50">
             <RefreshCcw className="mr-2 h-4 w-4" /> Reset 
          </Button>
          <Button onClick={handleAddSemesterClick} className="w-full sm:w-auto shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Semester
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <section>
        <AcademicOverviewCards 
          cumulativeAverage={cumulativeAverage}
          passedCredits={passedCredits}
          totalRequiredCredits={config.totalRequiredCredits}
          inProgressCredits={inProgressCredits}
          plannedCredits={plannedCredits}
          estimatedSemestersLeft={estimatedSemestersLeft}
        />
      </section>

      {/* Semesters / Planner Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-bold tracking-tight text-foreground">Semester Plan</h2>
        </div>
        
        {semesters.length === 0 ? (
          <EmptyState onAddSemester={handleAddSemesterClick} />
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {semesters.map(semester => (
              <SemesterCard 
                key={semester.id}
                semester={semester}
                courses={courses.filter(c => c.semesterId === semester.id)}
                onAddCourse={handleAddCourseClick}
                onEditCourse={handleEditCourseClick}
                onDeleteCourse={handleDeleteCourse}
                onEditSemester={handleEditSemesterClick}
                onDeleteSemester={handleDeleteSemester}
              />
            ))}
          </div>
        )}
      </section>

      {/* Dialogs */}
      <AddSemesterDialog 
        open={semesterDialogOpen} 
        onOpenChange={setSemesterDialogOpen}
        onSave={handleSaveSemester}
        initialData={editingSemester}
      />

      {activeSemesterIdForCourse && (
        <AddCourseDialog
            open={courseDialogOpen}
            onOpenChange={setCourseDialogOpen}
            semesterId={activeSemesterIdForCourse}
            onSave={handleSaveCourse}
            initialData={editingCourse}
        />
      )}

    </div>
  );
}
