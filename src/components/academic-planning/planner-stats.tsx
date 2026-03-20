import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Percent, CalendarDays, CheckCircle2, Clock } from "lucide-react";

interface AcademicPlannerStatsProps {
  cumulativeAverage: number | null;
  passedCredits: number;
  totalRequiredCredits: number;
  inProgressCredits: number;
  plannedCredits: number;
  estimatedSemestersLeft: number;
}

export function AcademicPlannerStats({
  cumulativeAverage,
  passedCredits,
  totalRequiredCredits,
  inProgressCredits,
  plannedCredits,
  estimatedSemestersLeft
}: AcademicPlannerStatsProps) {
  
  const remainingCredits = Math.max(0, totalRequiredCredits - passedCredits);
  const progressPercentage = Math.min(100, Math.round((passedCredits / totalRequiredCredits) * 100));

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      
      {/* Average Card */}
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group bg-card">
        <CardContent className="flex flex-col gap-3 pt-5">
          <div className="flex items-center gap-3">
             <div className="p-2.5 rounded-xl shrink-0 bg-blue-50 dark:bg-blue-900/20">
               <Percent className="w-5 h-5 text-blue-600 dark:text-blue-500" />
             </div>
             <div>
               <p className="text-2xl font-bold text-foreground tabular-nums">
                 {cumulativeAverage !== null ? cumulativeAverage.toFixed(1) : "--"}
                 <span className="text-sm font-normal text-muted-foreground ml-1">/ 100</span>
               </p>
               <p className="text-xs text-muted-foreground font-medium">Cumulative Average</p>
             </div>
          </div>
          <p className="text-xs text-muted-foreground/80 mt-1">
            {cumulativeAverage !== null ? "Based on weighted numeric grades" : "Complete courses to calculate average"}
          </p>
        </CardContent>
      </Card>

      {/* Degree Progress Card */}
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group bg-card">
        <CardContent className="flex flex-col gap-3 pt-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl shrink-0 bg-emerald-50 dark:bg-emerald-900/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
            </div>
            <div className="flex-1 flex justify-between items-center">
               <div>
                 <p className="text-2xl font-bold text-foreground tabular-nums">{passedCredits}</p>
                 <p className="text-xs text-muted-foreground font-medium">Passed Credits</p>
               </div>
               <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                  {progressPercentage}%
               </div>
            </div>
          </div>
          <div className="mt-1">
            <Progress value={progressPercentage} className="h-1.5 bg-muted" />
            <p className="text-xs text-muted-foreground/80 mt-2">
               {remainingCredits} hours remaining out of {totalRequiredCredits}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Estimate Card & Credits Info */}
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group bg-card">
        <CardContent className="flex flex-col gap-3 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl shrink-0 bg-orange-50 dark:bg-orange-900/20">
              <GraduationCap className="w-5 h-5 text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground tabular-nums flex items-baseline gap-1">
                {estimatedSemestersLeft > 0 ? "~" + (Math.ceil(estimatedSemestersLeft * 10) / 10).toString() : "0"}
                <span className="text-sm font-medium text-muted-foreground">left</span>
              </p>
              <p className="text-xs text-muted-foreground font-medium">Estimated Semesters</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-1 pt-3 border-t border-border/50">
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <div className="text-[11px] text-muted-foreground font-medium truncate">{inProgressCredits} hr in progress</div>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></div>
                <div className="text-[11px] text-muted-foreground font-medium truncate">{plannedCredits} hr planned</div>
             </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
