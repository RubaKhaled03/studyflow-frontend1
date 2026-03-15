"use client";

import { useState, useMemo } from "react";
import { ReflectionEntry, MoodType } from "@/types/reflections";
import { useAppState } from "@/hooks/use-app-state";
import { MOODS, filterReflections, sortReflectionsDesc } from "@/lib/reflections/utils";
import { ReflectionsEmptyState } from "@/components/reflections/reflections-empty-state";
import { ReflectionsHeader } from "@/components/reflections/reflections-header";
import { ReflectionsStats } from "@/components/reflections/reflections-stats";
import { ReflectionCard } from "@/components/reflections/reflection-card";
import { ReflectionFormDialog } from "@/components/reflections/reflection-form-dialog";
import { ReflectionDetailDialog } from "@/components/reflections/reflection-detail-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

export default function ReflectionsPage() {
  const { state, isLoaded, updateState } = useAppState();
  const reflections = state.reflections;

  // Filters state
  const [periodFilter, setPeriodFilter] = useState<"all" | "this-week" | "this-month">("all");
  const [moodFilter, setMoodFilter] = useState<MoodType | "all">("all");

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeEntry, setActiveEntry] = useState<ReflectionEntry | null>(null);
  const [reflectionToDelete, setReflectionToDelete] = useState<string | null>(null);

  // Derived state for display
  const displayedReflections = useMemo(() => {
    const filtered = filterReflections(reflections, periodFilter, moodFilter);
    return sortReflectionsDesc(filtered);
  }, [reflections, periodFilter, moodFilter]);

  // Handlers
  const handleAddClick = () => {
    setActiveEntry(null);
    setFormOpen(true);
  };

  const handleEditClick = (entry: ReflectionEntry) => {
    setActiveEntry(entry);
    setDetailOpen(false); // Close detail if open
    setFormOpen(true);
  };

  const handleViewClick = (entry: ReflectionEntry) => {
    setActiveEntry(entry);
    setDetailOpen(true);
  };

  const handleDelete = (id: string) => {
    setReflectionToDelete(id);
  };

  const confirmDelete = () => {
    if (reflectionToDelete) {
      updateState(prev => ({
        ...prev,
        reflections: prev.reflections.filter(r => r.id !== reflectionToDelete)
      }));
      setDetailOpen(false);
      setReflectionToDelete(null);
    }
  };

  const handleSaveEntry = (entry: ReflectionEntry) => {
    updateState(prev => {
      const existingReflections = prev.reflections;
      const idx = existingReflections.findIndex(r => r.id === entry.id);
      let nextReflections = [];
      if (idx >= 0) {
        nextReflections = [...existingReflections];
        nextReflections[idx] = entry;
      } else {
        nextReflections = [entry, ...existingReflections];
      }
      return {
        ...prev,
        reflections: nextReflections
      };
    });
  };

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
<div className="space-y-6 pb-8 animate-in fade-in zoom-in-95 duration-500">      
      <ReflectionsHeader onAddReflection={handleAddClick} />

      {reflections.length > 0 && (
         <ReflectionsStats reflections={reflections} />
      )}

      {/* Main Content Area */}
      <section className="space-y-6">
        
        {/* Controls Bar */}
        {reflections.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20 p-3 rounded-2xl border border-border/50">
               <div className="flex items-center gap-2 px-1 text-sm font-medium text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  <span>Filter History</span>
               </div>
               <div className="flex items-center gap-3">
                  <Select value={periodFilter} onValueChange={(val: any) => setPeriodFilter(val)}>
                    <SelectTrigger className="w-[140px] bg-card h-9">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={moodFilter} onValueChange={(val: any) => setMoodFilter(val)}>
                    <SelectTrigger className="w-[140px] bg-card h-9">
                      <SelectValue placeholder="Mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Moods</SelectItem>
                      {MOODS.map(m => (
                          <SelectItem key={m.value} value={m.value} className="capitalize">{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
            </div>
        )}

        {/* Content Listing */}
        {reflections.length === 0 ? (
          <ReflectionsEmptyState onAddReflection={handleAddClick} />
        ) : displayedReflections.length === 0 ? (
          <div className="text-center py-20 px-4 border border-dashed rounded-2xl border-border/60 bg-muted/20 text-muted-foreground">
             <Filter className="w-10 h-10 mx-auto mb-3 opacity-20" />
             <p>No reflections match your current filters.</p>
             <Button onClick={() => {setPeriodFilter("all"); setMoodFilter("all");}} className="mt-3 text-primary font-medium hover:underline">
                Clear Filters
             </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {displayedReflections.map(entry => (
                 <ReflectionCard 
                    key={entry.id}
                    reflection={entry}
                    onView={handleViewClick}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                  />
             ))}
          </div>
        )}

      </section>

      {/* Dialogs */}
      <ReflectionFormDialog 
         open={formOpen}
         onOpenChange={setFormOpen}
         onSave={handleSaveEntry}
         initialData={activeEntry}
      />

      <ReflectionDetailDialog 
         open={detailOpen}
         onOpenChange={setDetailOpen}
         reflection={activeEntry}
         onEditClick={() => {
             setDetailOpen(false);
             setFormOpen(true);
         }}
         onDeleteClick={() => activeEntry && handleDelete(activeEntry.id)}
      />

      <ConfirmActionDialog
        isOpen={!!reflectionToDelete}
        title="Delete Reflection"
        description="Are you sure you want to delete this reflection? This cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setReflectionToDelete(null)}
      />

    </div>
  );
}
