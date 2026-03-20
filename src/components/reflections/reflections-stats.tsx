import { Card, CardContent } from "@/components/ui/card";
import { ReflectionEntry } from "@/types/reflections";
import { getMoodInfo, isDateInThisWeek } from "@/lib/reflections/utils";
import { LineChart, BookOpen, Flame, SmilePlus, Smile, Meh, Frown, Coffee, CloudRain } from "lucide-react";

interface ReflectionsStatsProps {
  reflections: ReflectionEntry[];
}

export function ReflectionsStats({ reflections }: ReflectionsStatsProps) {
  const totalCount = reflections.length;
  const thisWeekCount = reflections.filter(r => isDateInThisWeek(r.date)).length;

  const latestReflection = reflections.length > 0 
    ? [...reflections].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  const latestMoodValue = latestReflection?.mood || "neutral";
  const latestMoodInfo = getMoodInfo(latestMoodValue);

  const renderMoodIcon = (iconName: string, className: string) => {
      switch(iconName) {
         case "SmilePlus": return <SmilePlus className={className} />;
         case "Smile": return <Smile className={className} />;
         case "Meh": return <Meh className={className} />;
         case "Frown": return <Frown className={className} />;
         case "Coffee": return <Coffee className={className} />;
         case "CloudRain": return <CloudRain className={className} />;
         default: return <Smile className={className} />;
      }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Reflections */}
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group bg-card">
        <CardContent className="flex items-center gap-3 pt-5">
          <div className="p-2.5 rounded-xl shrink-0 bg-blue-50 dark:bg-blue-900/20">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{totalCount}</p>
            <p className="text-xs text-muted-foreground font-medium">Total Reflections</p>
          </div>
        </CardContent>
      </Card>

      {/* This Week */}
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group bg-card">
        <CardContent className="flex items-center gap-3 pt-5">
          <div className="p-2.5 rounded-xl shrink-0 bg-orange-50 dark:bg-orange-900/20">
            <Flame className="w-5 h-5 text-orange-600 dark:text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tabular-nums">{thisWeekCount}</p>
            <p className="text-xs text-muted-foreground font-medium">This Week</p>
          </div>
        </CardContent>
      </Card>

      {/* Latest Mood */}
      <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group bg-card">
        <CardContent className="flex items-center gap-3 pt-5">
          <div className="p-2.5 rounded-xl shrink-0 bg-emerald-50 dark:bg-emerald-900/20">
            <LineChart className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
          </div>
          <div className="flex-1">
            {latestReflection ? (
               <div className="flex items-center justify-between">
                 <div>
                    <div className="text-lg font-bold tracking-tight text-foreground capitalize leading-tight">
                        {latestMoodInfo.label}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[100px]">
                        {new Date(latestReflection.date).toLocaleDateString()}
                    </p>
                 </div>
                 <div className={`p-1.5 rounded-full border ${latestMoodInfo.colorClass}`}>
                    {renderMoodIcon(latestMoodInfo.icon, "w-5 h-5")}
                 </div>
               </div>
            ) : (
               <div>
                 <p className="text-2xl font-bold text-foreground opacity-50 tabular-nums">--</p>
                 <p className="text-xs text-muted-foreground font-medium">No Mood Yet</p>
               </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
