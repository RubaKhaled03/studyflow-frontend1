# Academic Events System - Test Checklist

## ✅ Implementation Complete

### Type System

- [x] EventType enum: "midterm" | "final" | "quiz" | "assignment" | "project" | "presentation" | "lab"
- [x] EventStatus enum: "upcoming" | "completed" | "missed"
- [x] HighlightLevel enum: "normal" | "important" | "urgent"
- [x] AcademicEvent interface with 11 properties
- [x] Course.academicEvents optional array field

### Utility Functions (15 total in week-utils.ts)

- [x] getUpcomingAcademicEvents() - sort by date
- [x] getDaysUntilEvent() - calculate days
- [x] isEventToday() - boolean check
- [x] isEventTomorrow() - boolean check
- [x] isEventThisWeek() - boolean check
- [x] isEventOverdue() - check if missed
- [x] getEventTimeLabel() - "Today", "Tomorrow", "In X days", or date
- [x] addAcademicEvent() - immutable add to course
- [x] updateAcademicEvent() - immutable update
- [x] deleteAcademicEvent() - immutable delete
- [x] getEventsByStatus() - filter by status
- [x] getUrgentEvents() - get urgent/important only

### UI Components

- [x] Urgent events alert section with visual alert (red gradient, pulsing icon)
- [x] Events timeline with cards showing:
  - [x] Event type icons (7 different icons by type)
  - [x] Title and urgency badge
  - [x] Date/time display with smart labels
  - [x] Time in blue badge (HH:MM - HH:MM format)
  - [x] Description preview (if available)
  - [x] Location display (if available)
  - [x] Overdue badge (for missed events)
  - [x] Delete button
- [x] Add event form (collapsed by default):
  - [x] Title input
  - [x] Type dropdown (7 event types)
  - [x] Highlight level dropdown
  - [x] Date picker
  - [x] Time input (optional)
  - [x] Description textarea
  - [x] Add/Cancel buttons
- [x] Empty state with "Add First Event" button

### State Management

- [x] showEventForm boolean state
- [x] newEvent Partial<AcademicEvent> state
- [x] handleAddEvent callback function
- [x] handleDeleteEvent callback function
- [x] upcomingEvents useMemo selector
- [x] urgentEvents useMemo selector

### Storage & Persistence

- [x] academicEvents saved to localStorage via saveCourseToStorage()
- [x] academicEvents loaded from localStorage via getCourseById()

### TypeScript & Compilation

- [x] No type errors
- [x] Proper EventType and HighlightLevel type annotations
- [x] All imports correct
- [x] CSS class names follow Tailwind conventions

---

## Manual Testing Steps

### 1. Navigate to a Course Details Page

- Open the app and go to any course (e.g., "Advanced Calculus")
- Expected: Course details page loads with header, progress, and study plan sections

### 2. View Empty Events State

- If no events exist, you should see:
  - Empty state card with "No upcoming deadlines" message
  - "Add First Event" button

### 3. Add an Event

- Click "Add Event" button
- Fill in form:
  - Title: "Midterm Exam"
  - Type: "Midterm"
  - Highlight: "Urgent"
  - Date: Pick a date soon (e.g., tomorrow)
  - Time: "2:00 PM"
  - End Time: (optional)
  - Description: "Comprehensive exam covering chapters 1-5"
- Click "Add Event"
- Expected: Event appears in timeline, form closes, list updates

### 4. Verify Event Display

- Event should show with:
  - 📊 midterm icon
  - "Midterm Exam" title
  - "urgent" badge in red
  - Smart date label ("Today", "Tomorrow", "In 3 days", or actual date)
  - Days remaining counter
  - Time displayed as "2:00 PM"
  - Description preview
  - Red delete button

### 5. Add Multiple Events

- Add 2-3 more events with different types:
  - Quiz (type: "quiz", highlight: "important")
  - Assignment (type: "assignment", highlight: "normal")
  - Final Exam (type: "final", highlight: "urgent")
- Expected: All events appear in list, sorted by date

### 6. Verify Urgent Events Alert

- If you have urgent/important events:
  - An alert section should appear at top with red border
  - Shows "Urgent: X deadline(s) coming up!"
  - Lists first 4 urgent events in a grid

### 7. Delete an Event

- Click red trash icon on an event
- Expected: Event removed from list immediately

### 8. Test Persistence

- Add an event to a course
- Refresh the page (F5)
- Expected: Event still appears after refresh

### 9. Test Form Validation

- Click "Add Event"
- Try to add without title
- Expected: Event doesn't get added (should prevent empty values)

### 10. Test Time Labels

- Add event for today
- Add event for tomorrow
- Add event for 3 days from now
- Add event for 2 weeks from now
- Expected: Labels show "Today", "Tomorrow", "In 3 days", or full date

---

## Visual Verification

### Color Scheme

- **Urgent events**: Red (#ef4444) with red-50 background
- **Important events**: Amber (#f59e0b) with amber-50 background
- **Normal events**: Gray (#6b7280) with gray-50 background

### Icons by Type

- Midterm: Award (purple)
- Final: Target (red)
- Quiz: Bookmark (blue)
- Assignment: FileText (orange)
- Project: Brain (green)
- Presentation: Presentation (pink)
- Lab: Microscope (cyan)

### Responsive Design

- Mobile (1 column): Events stack vertically
- Tablet (2 columns): Events in 2-column grid (urgent alerts)
- Desktop (3+ columns): Optimal spacing maintained

---

## Known Limitations

- None yet - all core features implemented

## Future Enhancements

- [ ] Edit existing events
- [ ] Recurring events (daily, weekly, etc.)
- [ ] Event notifications/reminders
- [ ] Calendar view
- [ ] Export events to calendar apps
- [ ] Color customization per event
- [ ] Event categories beyond type
- [ ] Collaborative events (shared with classmates)
