"use client";

import { useState, useMemo } from "react";
import { Course, CourseStatus } from "@/types/course";
import { CourseCard } from "@/components/courses/course-card";
import { CoursesTabs } from "@/components/courses/courses-tabs";
import { AddCourseDialog } from "@/components/courses/add-course-dialog";
import { DeleteCourseAlertDialog } from "@/components/courses/delete-course-alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useAppState } from "@/hooks/use-app-state";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CoursesPage() {
  const { state, isLoaded, updateState } = useAppState();
  const courses = state.courses;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CourseStatus | "all">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeTab === "all" || course.status === (activeTab as CourseStatus);

      const isNotPrior = course.semesterId !== "prior-completed";
      return matchesSearch && matchesTab && isNotPrior;
    });
  }, [courses, searchQuery, activeTab]);

  const counts = useMemo(() => {
    const mainCourses = courses.filter(c => c.semesterId !== "prior-completed");
    return {
      all: mainCourses.length,
      current: mainCourses.filter((c) => c.status === "current").length,
      completed: mainCourses.filter((c) => c.status === "completed").length,
      planned: mainCourses.filter((c) => c.status === "planned").length,
    };
  }, [courses]);

  const handleAddCourse = () => {
    setSelectedCourse(undefined);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      updateState(prev => ({
        ...prev,
        courses: prev.courses.filter((c) => c.id !== courseToDelete.id)
      }));
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleSaveCourse = (courseData: Omit<Course, "id">) => {
    updateState(prev => {
      let updatedCourses = [];
      if (isEditing && selectedCourse) {
        updatedCourses = prev.courses.map((c) =>
          c.id === selectedCourse.id ? { ...courseData, id: c.id } as Course : c
        );
      } else {
        const newCourse: Course = {
          ...courseData,
          id: Date.now().toString(),
        };
        updatedCourses = [...prev.courses, newCourse];
      }
      return { ...prev, courses: updatedCourses };
    });

    setIsDialogOpen(false);
    setSelectedCourse(undefined);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">  
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">My Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Manage and track all your academic courses.
          </p>
        </div>
        <Button
          onClick={handleAddCourse}
          size="lg"
          className="bg-primary hover:bg-secondary"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Course
        </Button>
      </div>
      <div className="border-b">
        <CoursesTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />
      </div>
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No courses found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search query"
              : "Add your first course to get started"}
          </p>

          {!searchQuery && (
            <Button
              onClick={handleAddCourse}
              className="mt-4 bg-primary hover:bg-secondary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          )}
        </div>
      )}
      <AddCourseDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedCourse(undefined);
            setIsEditing(false);
          }
        }}
        onSave={handleSaveCourse}
        initialData={selectedCourse}
        isEditing={isEditing}
      />
      <DeleteCourseAlertDialog
        isOpen={isDeleteDialogOpen}
        course={courseToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setCourseToDelete(null);
        }}
      />
    </div>
  );
}
