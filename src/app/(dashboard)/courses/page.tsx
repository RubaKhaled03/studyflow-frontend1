"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { Course, CourseStatus } from "@/types/course";
import { CourseCard } from "@/components/courses/course-card";
import { CoursesTabs } from "@/components/courses/courses-tabs";
import { AddCourseDialog } from "@/components/courses/add-course-dialog";
import { DeleteCourseAlertDialog } from "@/components/courses/delete-course-alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { getCourses, STORAGE_KEY } from "@/lib/courses-storage";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return false;
}

function getClientSnapshot() {
  return true;
}

function useHydrated() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

export default function CoursesPage() {
  const mounted = useHydrated();
  const [courses, setCourses] = useState<Course[]>(getCourses());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<CourseStatus | "all">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }, [courses, mounted]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" || course.status === (activeTab as CourseStatus);

    return matchesSearch && matchesTab;
  });

  const counts = {
    all: courses.length,
    current: courses.filter((c) => c.status === "current").length,
    completed: courses.filter((c) => c.status === "completed").length,
    planned: courses.filter((c) => c.status === "planned").length,
  };

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
      setCourses(courses.filter((c) => c.id !== courseToDelete.id));
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const handleSaveCourse = (courseData: Omit<Course, "id">) => {
    if (isEditing && selectedCourse) {
      setCourses(
        courses.map((c) =>
          c.id === selectedCourse.id ? { ...courseData, id: c.id } : c,
        ),
      );
    } else {
      const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
      };
      setCourses([...courses, newCourse]);
    }

    setIsDialogOpen(false);
    setSelectedCourse(undefined);
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          <Spinner />
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedCourse(undefined);
          setIsEditing(false);
        }}
        onSave={handleSaveCourse}
        initialCourse={selectedCourse}
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
      />{" "}
    </div>
  );
}
