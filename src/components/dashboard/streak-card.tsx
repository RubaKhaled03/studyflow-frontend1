"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { useMemo } from "react";

interface StreakCardProps {
  count: number;
}

export function StreakCard({ count }: StreakCardProps) {
  const isHighStreak = count >= 3;
  const isEpicStreak = count >= 7;

  const motivationalMessage = useMemo(() => {
    if (count === 0) return "Start your journey today! 🔥";
    if (count <= 2) return "Great start! Keep building your streak 🔥";
    if (count <= 6) return "You're on a roll! Don't break the chain 💪";
    return "Amazing consistency! You're doing great 🚀";
  }, [count]);

  const gradientClass = useMemo(() => {
    if (isEpicStreak) return "bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 border-none text-white shadow-[0_0_20px_rgba(234,88,12,0.3)]";
    if (isHighStreak) return "bg-gradient-to-br from-orange-400 to-red-500 border-none text-white shadow-lg";
    return "bg-card border shadow-sm";
  }, [isHighStreak, isEpicStreak]);

  const iconBgClass = useMemo(() => {
    if (isHighStreak) return "bg-white/20";
    return "bg-orange-500/10";
  }, [isHighStreak]);

  const iconColorClass = useMemo(() => {
    if (isHighStreak) return "text-white";
    return "text-orange-600";
  }, [isHighStreak]);

  return (
    <Card className={`${gradientClass} transition-all duration-500 hover:scale-[1.02]`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className={`text-sm font-medium ${isHighStreak ? "text-white/90" : "text-muted-foreground"}`}>
          Daily Streak
        </CardTitle>
        <div className={`w-10 h-10 rounded-full ${iconBgClass} flex items-center justify-center animate-pulse`}>
          <Flame className={`h-6 w-6 ${iconColorClass} fill-current`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-4xl font-black tracking-tight">{count}</div>
          <div className={`text-sm font-bold ${isHighStreak ? "text-white/80" : "text-muted-foreground"}`}>Days</div>
        </div>
        <p className={`text-xs mt-2 font-medium ${isHighStreak ? "text-white/80" : "text-muted-foreground"}`}>
          {motivationalMessage}
        </p>
      </CardContent>
    </Card>
  );
}
