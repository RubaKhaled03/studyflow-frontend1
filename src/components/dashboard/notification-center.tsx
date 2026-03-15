"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/hooks/use-app-state";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { NotificationItem } from "./notification-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function NotificationCenter() {
  const { state, updateState } = useAppState();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  
  const notifications = state.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    
    updateState({
      notifications: notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    });

    if (notification?.targetRoute) {
      router.push(notification.targetRoute);
      setOpen(false);
    }
  };

  const handleMarkAllRead = () => {
    updateState({
      notifications: notifications.map(n => ({ ...n, read: true }))
    });
  };

  const handleClearAll = () => {
    updateState({ notifications: [] });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0 shadow-2xl border-primary/10" align="end">
        <div className="flex items-center justify-between p-4 bg-muted/30">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold">Notifications</h4>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              {unreadCount} unread messages
            </p>
          </div>
          <div className="flex gap-1">
            {notifications.length > 0 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary" 
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                >
                  <CheckCheck className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500" 
                  onClick={handleClearAll}
                  title="Clear all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        <Separator />
        
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  When you have notifications, they'll appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onClick={handleMarkAsRead} 
                  />
                ))}
            </div>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <div className="p-2 bg-muted/30 border-t">
            <Button variant="ghost" size="sm" className="w-full text-xs font-medium text-muted-foreground" disabled>
              End of notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
