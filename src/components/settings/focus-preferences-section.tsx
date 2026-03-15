"use client";

import { FocusPreferences } from "@/types/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Timer, Coffee, Play, Zap } from "lucide-react";

interface FocusPreferencesSectionProps {
  preferences: FocusPreferences;
  onUpdate: (updates: Partial<FocusPreferences>) => void;
}

export function FocusPreferencesSection({ preferences, onUpdate }: FocusPreferencesSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight">Focus Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Customize your deep work sessions and Pomodoro settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Session Durations
            </CardTitle>
            <CardDescription>
              Set your target time for focus and breaks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <Label>Focus Session (minutes)</Label>
              </div>
              <Select 
                value={preferences.preferredSessionDuration.toString()} 
                onValueChange={(val) => onUpdate({ preferredSessionDuration: parseInt(val) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="25">25 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-muted-foreground" />
                <Label>Short Break (minutes)</Label>
              </div>
              <Select 
                value={preferences.preferredBreakDuration.toString()} 
                onValueChange={(val) => onUpdate({ preferredBreakDuration: parseInt(val) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Play className="h-4 w-4 text-primary" />
              Automation & Flow
            </CardTitle>
            <CardDescription>
              Control how sessions transition.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-break" className="flex flex-col gap-0.5">
                <span>Auto-start Breaks</span>
                <span className="text-[10px] font-normal text-muted-foreground">Automatically begin break after focus session ends</span>
              </Label>
              <Switch 
                id="auto-break" 
                checked={preferences.autoStartBreak}
                onCheckedChange={(checked) => onUpdate({ autoStartBreak: checked })}
              />
            </div>

            <div className="space-y-3 pt-2">
              <Label>Default Mode</Label>
              <Select 
                value={preferences.defaultFocusMode} 
                onValueChange={(val: "pomodoro" | "stopwatch") => onUpdate({ defaultFocusMode: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pomodoro">Pomodoro (Timed)</SelectItem>
                  <SelectItem value="stopwatch">Stopwatch (Open-ended)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
