import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlannerCourse, PlannerCourseStatus } from "@/types/academic-planning";

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  semesterId: string;
  onSave: (course: PlannerCourse) => void;
  initialData?: PlannerCourse | null;
}

// Fallback ID generator when uuid isn't present
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function AddCourseDialog({ open, onOpenChange, semesterId, onSave, initialData }: AddCourseDialogProps) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [credits, setCredits] = useState<number | "">("");
  const [status, setStatus] = useState<PlannerCourseStatus>("planned");
  const [numericGrade, setNumericGrade] = useState<number | "">("");

  useEffect(() => {
    if (open) {
      if (initialData) {
        setTitle(initialData.title);
        setCode(initialData.code || "");
        setCredits(initialData.credits);
        setStatus(initialData.status);
        setNumericGrade(initialData.numericGrade ?? "");
      } else {
        setTitle("");
        setCode("");
        setCredits("");
        setStatus("planned");
        setNumericGrade("");
      }
    }
  }, [open, initialData]);

  const handleSave = () => {
    if (!title.trim() || credits === "" || credits <= 0) return;
    
    // Grade constraint logic
    let finalGrade: number | null = null;
    if (status === "completed") {
      finalGrade = typeof numericGrade === "number" ? numericGrade : null;
      if (finalGrade === null) return; // Cannot save completed course without grade
      // Enforce 0-100 boundary
      if (finalGrade < 0) finalGrade = 0;
      if (finalGrade > 100) finalGrade = 100;
    }

    onSave({
       id: initialData ? initialData.id : generateId(),
      semesterId: initialData ? initialData.semesterId : semesterId,
      title,
      code,
      credits: credits as number,
      status,
      numericGrade: finalGrade,
    });
    onOpenChange(false);
  };

  const isSaveDisabled = !title.trim() || credits === "" || credits <= 0 || (status === "completed" && numericGrade === "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{initialData ? "Edit Course" : "Add Course"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="course-title" className="text-muted-foreground font-semibold">Course Title <span className="text-red-500">*</span></Label>
              <Input
                id="course-title"
                placeholder="e.g. Calculus I"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course-code" className="text-muted-foreground font-semibold">Course Code</Label>
              <Input
                id="course-code"
                placeholder="e.g. MATH 101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-10 placeholder:text-muted-foreground/50 uppercase"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course-credits" className="text-muted-foreground font-semibold">Credit Hours <span className="text-red-500">*</span></Label>
              <Input
                id="course-credits"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 3"
                value={credits}
                onChange={(e) => setCredits(e.target.value ? Number(e.target.value) : "")}
                className="h-10 placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course-status" className="text-muted-foreground font-semibold">Status</Label>
              <Select value={status} onValueChange={(val: PlannerCourseStatus) => setStatus(val)}>
                <SelectTrigger id="course-status" className="h-10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === "completed" && (
              <div className="grid gap-2 animate-in fade-in zoom-in duration-200">
                <Label htmlFor="course-grade" className="text-muted-foreground font-semibold">Numeric Grade (0-100) <span className="text-red-500">*</span></Label>
                <Input
                  id="course-grade"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="e.g. 85"
                  value={numericGrade}
                  onChange={(e) => setNumericGrade(e.target.value ? Number(e.target.value) : "")}
                  className="h-10 placeholder:text-muted-foreground/50 border-emerald-500/20 focus-visible:ring-emerald-500/30"
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl w-full sm:w-auto">Cancel</Button>
          <Button onClick={handleSave} disabled={isSaveDisabled} className="rounded-xl w-full sm:w-auto">Save Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
