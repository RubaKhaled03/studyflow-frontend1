"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, ArrowRight, Percent } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlannerCourse, AcademicPlannerConfig } from "@/types/academic-planning";
import { calculateCumulativeAverage, calculatePassedCompletedCredits } from "@/lib/academic-planning/utils";

export function AcademicProgress() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cumulativeAverage, setCumulativeAverage] = useState<number | null>(null);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(144);

  // Load from localStorage so the widget reflects the actual planner
  useEffect(() => {
    try {
      const savedCourses = localStorage.getItem("studyflow_planner_courses");
      const savedConfig = localStorage.getItem("studyflow_planner_config");

      if (savedConfig) {
        const config: AcademicPlannerConfig = JSON.parse(savedConfig);
        setTotalCredits(config.totalRequiredCredits);
      }

      if (savedCourses) {
        const courses: PlannerCourse[] = JSON.parse(savedCourses);
        const calcAvg = calculateCumulativeAverage(courses);
        const passedCredits = calculatePassedCompletedCredits(courses);
        
        setCumulativeAverage(calcAvg);
        setCompletedCredits(passedCredits);
      }
    } catch (e) {
      console.error("Failed to parse planner data for widget", e);
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
      return (
          <Card className="flex flex-col h-full border-none shadow-sm animate-pulse bg-muted/20">
             <CardContent className="p-6 h-[200px] flex items-center justify-center text-muted-foreground text-sm">Loading...</CardContent>
          </Card>
      );
  }

  const remainingCredits = Math.max(0, totalCredits - completedCredits);
  const progressPercentage = Math.round((completedCredits / totalCredits) * 100);

  return (
    <Card className="flex flex-col h-full border-none shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>
      
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
          <GraduationCap className="h-5 w-5 text-emerald-500" />
          Academic Progress
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="hidden sm:flex -mr-2 text-muted-foreground hover:text-primary transition-colors">
            <Link href="/academic-planning">
              Open Planner <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-center gap-6 pt-4">
        
        <Link href="/academic-planning" className="absolute inset-0 z-0 sm:hidden" aria-label="Open Academic Planner"></Link>

        <div className="flex justify-between items-end border-b border-border/60 pb-5 relative z-10 pointer-events-none sm:pointer-events-auto">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" /> Cumulative Average
            </p>
            <p className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              {cumulativeAverage !== null ? cumulativeAverage.toFixed(1) : "--"}<span className="text-sm text-foreground/50 ml-1 font-normal">/100</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground mb-1">Passed Hours</p>
            <p className="text-xl font-semibold">
              <span className="text-foreground">{completedCredits}</span>
              <span className="text-muted-foreground text-sm"> / {totalCredits}</span>
            </p>
          </div>
        </div>

        <div className="space-y-2.5 relative z-10 pointer-events-none sm:pointer-events-auto">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md dark:bg-emerald-500/10">{progressPercentage}% Completed</span>
            <span className="text-muted-foreground">{remainingCredits} hours left</span>
          </div>
          <Progress value={progressPercentage} className="h-2.5 bg-muted"  />
        </div>
      </CardContent>
    </Card>
  );
}
