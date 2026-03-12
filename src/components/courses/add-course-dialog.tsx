"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { CourseImageUploader } from "./course-image-uploader";
import { CourseStatusSelector } from "./course-status-selector";

interface AddCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, "id">) => void;
  initialCourse?: Course;
  isEditing?: boolean;
}

const defaultFormData: Omit<Course, "id"> = {
  title: "",
  instructor: "",
  credits: 3,
  semester: "",
  status: "planned",
  imageUrl: "",
  durationWeeks: 13,
  code: "",
  description: "",
  progress: undefined,
  finalGrade: undefined,
};

export function AddCourseDialog({
  isOpen,
  onClose,
  onSave,
  initialCourse,
  isEditing = false,
}: AddCourseDialogProps) {
  const [formData, setFormData] = useState<Omit<Course, "id">>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialCourse) {
        setFormData({
          title: initialCourse.title,
          instructor: initialCourse.instructor,
          credits: initialCourse.credits,
          semester: initialCourse.semester,
          status: initialCourse.status,
          imageUrl: initialCourse.imageUrl,
          durationWeeks: initialCourse.durationWeeks || 13,
          code: initialCourse.code || "",
          description: initialCourse.description || "",
          startDate: initialCourse.startDate || "",
          endDate: initialCourse.endDate || "",
          progress: initialCourse.progress || undefined,
          finalGrade: initialCourse.finalGrade || undefined,
        });
      } else if (!isEditing) {
        // Reset to defaults when opening for new course
        setFormData(defaultFormData);
      }
    }
  }, [isOpen, isEditing, initialCourse]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor name is required";
    }

    if (isNaN(formData.credits) || formData.credits < 1) {
      newErrors.credits = "Credits must be a positive number";
    }

    if (!formData.semester.trim()) {
      newErrors.semester = "Semester is required";
    }

    if (
      isNaN(formData.durationWeeks) ||
      formData.durationWeeks < 1 ||
      formData.durationWeeks > 52
    ) {
      newErrors.durationWeeks = "Duration must be between 1 and 52 weeks";
    }

    if (!formData.status) {
      newErrors.status = "Course status is required";
    }

    if (
      formData.status === "current" &&
      (formData.progress === undefined ||
        formData.progress < 0 ||
        formData.progress > 100)
    ) {
      newErrors.progress = "Progress must be between 0 and 100";
    }

    if (formData.status === "completed" && !formData.finalGrade?.trim()) {
      newErrors.finalGrade = "Final grade is required for completed courses";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData(defaultFormData);
    setErrors({});
    onClose();
  };

  const handleImageSelect = (base64: string) => {
    // Directly save the selected image to form data
    setFormData({ ...formData, imageUrl: base64 });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Card className="w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {isEditing ? "Edit Course" : "Add Course"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Course Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Advanced Calculus"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Instructor Name */}
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor Name *</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) =>
                  setFormData({ ...formData, instructor: e.target.value })
                }
                placeholder="e.g., Dr. Sarah Jenkins"
                className={errors.instructor ? "border-red-500" : ""}
              />
              {errors.instructor && (
                <p className="text-sm text-red-500">{errors.instructor}</p>
              )}
            </div>

            {/* Course Code (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g., CS101"
              />
            </div>

            {/* Credits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credits">Credits *</Label>
                <Input
                  id="credits"
                  type="number"
                  min="1"
                  value={formData.credits}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: parseInt(e.target.value) || 0,
                    })
                  }
                  className={errors.credits ? "border-red-500" : ""}
                />
                {errors.credits && (
                  <p className="text-sm text-red-500">{errors.credits}</p>
                )}
              </div>

              {/* Duration in Weeks */}
              <div className="space-y-2">
                <Label htmlFor="durationWeeks">Duration (Weeks) *</Label>
                <Input
                  id="durationWeeks"
                  type="number"
                  min="1"
                  max="52"
                  value={formData.durationWeeks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationWeeks: parseInt(e.target.value) || 13,
                    })
                  }
                  className={errors.durationWeeks ? "border-red-500" : ""}
                />
                {errors.durationWeeks && (
                  <p className="text-sm text-red-500">{errors.durationWeeks}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  e.g., 13 for regular semester
                </p>
              </div>
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Input
                id="semester"
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
                placeholder="e.g., Fall 2025"
                className={errors.semester ? "border-red-500" : ""}
              />
              {errors.semester && (
                <p className="text-sm text-red-500">{errors.semester}</p>
              )}
            </div>

            {/* Status */}
            <CourseStatusSelector
              value={formData.status}
              onChange={(status) =>
                setFormData({
                  ...formData,
                  status,
                  progress:
                    status === "current" ? (formData.progress ?? 0) : undefined,
                  finalGrade:
                    status === "completed" ? formData.finalGrade : undefined,
                })
              }
              error={errors.status}
            />

            {/* Progress - only for current courses */}
            {formData.status === "current" && (
              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%) *</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      progress: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                  className={errors.progress ? "border-red-500" : ""}
                />
                {errors.progress && (
                  <p className="text-sm text-red-500">{errors.progress}</p>
                )}
              </div>
            )}

            {/* Final Grade - only for completed courses */}
            {formData.status === "completed" && (
              <div className="space-y-2">
                <Label htmlFor="finalGrade">Final Grade *</Label>
                <Input
                  id="finalGrade"
                  value={formData.finalGrade ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, finalGrade: e.target.value })
                  }
                  placeholder="e.g., 92 (A)"
                  className={errors.finalGrade ? "border-red-500" : ""}
                />
                {errors.finalGrade && (
                  <p className="text-sm text-red-500">{errors.finalGrade}</p>
                )}
              </div>
            )}

            {/* Course Image Upload */}
            <div className="border-t pt-4">
              <CourseImageUploader
                onImageSelect={handleImageSelect}
                currentImage={formData.imageUrl}
              />
            </div>

            {/* Description (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="description">Description / Notes</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Add course notes or resources..."
                className="w-full px-3 py-2 border border-input rounded-md text-sm"
                rows={3}
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {isEditing ? "Save Changes" : "Create Course"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
