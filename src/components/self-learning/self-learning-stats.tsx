"use client";
import { Card, CardContent } from "@/components/ui/card";
import { type SelfLearningStats as StatsType } from "@/types/self-learning";
import { BookOpen, Zap, CheckCircle2, PauseCircle, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsProps { stats: StatsType; }

const CARDS = [
  { key: "total",              label: "Total Plans",         icon: BookOpen,      gradient: "from-violet-500 to-purple-600",  bg: "bg-violet-50 dark:bg-violet-900/20" },
  { key: "active",             label: "Active",              icon: Zap,           gradient: "from-blue-500 to-cyan-500",      bg: "bg-blue-50 dark:bg-blue-900/20" },
  { key: "completed",          label: "Completed",           icon: CheckCircle2,  gradient: "from-emerald-500 to-green-600",  bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { key: "upcomingMilestones", label: "Upcoming Milestones", icon: CalendarCheck, gradient: "from-amber-500 to-orange-500",   bg: "bg-amber-50 dark:bg-amber-900/20" },
] as const;

export function SelfLearningStats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, icon: Icon, gradient, bg }) => (
        <Card key={key} className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group">
          <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
          <CardContent className="flex items-center gap-3 pt-5">
            <div className={cn("p-2.5 rounded-xl shrink-0", bg)}>
              <Icon className={cn("w-5 h-5", gradient.split(' ')[0].replace('from-', 'text-'))} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground tabular-nums">{stats[key as keyof StatsType]}</p>
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
