"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, BookOpen, CheckSquare, GraduationCap, ClipboardList, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/hooks/use-app-state";
import { selectSearchItems, SearchItem } from "@/lib/store/app-selectors";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function GlobalSearch() {
  const { state } = useAppState();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchItems = useMemo(() => selectSearchItems(state), [state]);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return searchItems.filter(
      item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.description?.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Limit to 8 results
  }, [searchItems, query]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (path: string) => {
    router.push(path);
    setQuery("");
    setIsOpen(false);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "Course": return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "Task": return <CheckSquare className="h-4 w-4 text-emerald-500" />;
      case "Exam": return <ClipboardList className="h-4 w-4 text-rose-500" />;
      case "Self-Learning": return <GraduationCap className="h-4 w-4 text-amber-500" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative w-full max-w-md group" ref={containerRef}>
      <div className="relative">
        <Search className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
          isOpen ? "text-primary" : "text-muted-foreground"
        )} />
        <Input
          type="search"
          placeholder="Search courses, tasks, exams..."
          className="pl-10 pr-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30 transition-all rounded-xl h-10 w-full"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {isOpen && filteredResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              Quick Results
            </div>
            {filteredResults.map((item: SearchItem) => (
              <button
                key={`${item.category}-${item.id}`}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 rounded-xl transition-colors text-left group/item"
                onClick={() => handleSelect(item.path)}
              >
                <div className="p-2 rounded-lg bg-background border border-border group-hover/item:border-primary/20 transition-colors">
                  {getIcon(item.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span className="font-medium text-primary/70">{item.category}</span>
                    {item.description && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span className="truncate">{item.description}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="p-2 bg-muted/20 border-t border-border/50 text-center">
             <div className="text-[10px] text-muted-foreground">
               Press <kbd className="font-sans px-1 rounded border bg-background">ESC</kbd> to close
             </div>
          </div>
        </div>
      )}

      {isOpen && query.trim() !== "" && filteredResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-8 bg-card border border-border rounded-2xl shadow-xl text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
             <Search className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <h3 className="text-sm font-semibold mb-1">No results found</h3>
          <p className="text-xs text-muted-foreground">We couldn't find anything matching "{query}"</p>
        </div>
      )}
    </div>
  );
}
