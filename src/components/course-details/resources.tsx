"use client";

import { Resource } from "@/types/course";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Play, Link, Plus, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ResourcesProps {
  resources?: Resource[];
  onAddResource?: () => void;
}

export function Resources({ resources = [], onAddResource }: ResourcesProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Play className="h-4 w-4" />;
      case "link":
        return <Link className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "image":
        return <FileText className="h-4 w-4" />;
      default:
        return <Link className="h-4 w-4" />;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case "pdf":
        return "text-red-600 dark:text-red-400 bg-red-100/20 dark:bg-red-900/20";
      case "video":
        return "text-purple-600 dark:text-purple-400 bg-purple-100/20 dark:bg-purple-900/20";
      case "link":
        return "text-blue-600 dark:text-blue-400 bg-blue-100/20 dark:bg-blue-900/20";
      case "document":
        return "text-amber-600 dark:text-amber-400 bg-amber-100/20 dark:bg-amber-900/20";
      case "image":
        return "text-teal-600 dark:text-teal-400 bg-teal-100/20 dark:bg-teal-900/20";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-100/20 dark:bg-slate-900/20";
    }
  };

  return (
    <Card className="p-6 border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Course Resources
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setShowAddForm(!showAddForm);
            onAddResource?.();
          }}
          className="gap-1 h-auto p-1.5"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {resources.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            No resources added yet
          </p>
          <Button
            size="sm"
            onClick={() => {
              setShowAddForm(true);
              onAddResource?.();
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-md shrink-0 ${getResourceColor(
                    resource.type,
                  )}`}
                >
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100 group-hover:underline line-clamp-2">
                    {resource.title}
                  </p>
                  {resource.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {resource.description}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wide">
                    {resource.type}
                  </p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
              </div>
            </a>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setShowAddForm(true);
              onAddResource?.();
            }}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Another Resource
          </Button>
        </div>
      )}
    </Card>
  );
}
