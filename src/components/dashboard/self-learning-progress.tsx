import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Route, PlaySquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SelfLearningProgress() {
  const currentPlan = "Advanced Web Development";
  const progressPercentage = 60;

  return (
    <Card className="flex flex-col h-full border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Route className="h-5 w-5 text-primary" />
          Self Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-4">
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-border/50 bg-gradient-to-br from-card to-muted/30">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Current Plan</p>
                <h3 className="text-base font-semibold leading-tight">{currentPlan}</h3>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <PlaySquare className="h-4 w-4 text-primary" />
              </div>
            </div>
            
            <div className="space-y-1.5 mt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Course Progress</span>
                <span className="text-primary">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2 rounded-full" />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button variant="default" className="w-full gap-2 group" asChild>
            <Link href="/dashboard/self-learning">
              Continue Learning 
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
