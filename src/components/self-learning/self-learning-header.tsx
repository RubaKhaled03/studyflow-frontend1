"use client";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";

interface SelfLearningHeaderProps {
  onNewPlan: () => void;
}

export function SelfLearningHeader({ onNewPlan }: SelfLearningHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-violet-500" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Self-Learning</h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Track your personal learning journey, build skills, and grow step by step.
        </p>
      </div>
      <Button onClick={onNewPlan} className="gap-2 shrink-0 rounded-xl shadow-sm">
        <Plus className="h-4 w-4" /> New Learning Plan
      </Button>
    </div>
  );
}
