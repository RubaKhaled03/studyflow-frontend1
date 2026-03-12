import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap } from "lucide-react";

export function AcademicProgress() {
  const gpa = 3.25;
  const completedCredits = 75;
  const remainingCredits = 45;
  const totalCredits = completedCredits + remainingCredits;
  const progressPercentage = Math.round((completedCredits / totalCredits) * 100);

  return (
    <Card className="flex flex-col h-full border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Academic Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center gap-6 pt-4">
        <div className="flex justify-between items-end border-b border-border/50 pb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Current GPA</p>
            <p className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
              {gpa.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground mb-1">Credits</p>
            <p className="text-xl font-semibold">
              <span className="text-foreground">{completedCredits}</span>
              <span className="text-muted-foreground text-sm"> / {totalCredits}</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-foreground">{progressPercentage}% Completed</span>
            <span className="text-muted-foreground">{remainingCredits} left</span>
          </div>
          <Progress value={progressPercentage} className="h-3 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
