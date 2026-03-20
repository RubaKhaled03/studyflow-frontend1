# API Requirements for StudyFlow Backend

This document outlines the required endpoints and data structures needed for the StudyFlow frontend to function with a live backend.

## 1. Authentication Service

### Endpoints
- `POST /auth/register`: Create a new students account.
- `POST /auth/login`: Authenticate and receive a JWT.
- `GET /auth/profile`: Get current user info (requires header).
- `POST /auth/forgot-password`: Trigger password reset email.
- `POST /auth/reset-password`: Update password using token.

### Data Structure (UserProfile)
```json
{
  "id": "string",
  "name": "string",
  "university": "string",
  "major": "string",
  "academicYear": "string",
  "currentGPA": "string",
  "totalCreditHours": "string",
  "completedCreditHours": "string",
  "avatarUrl": "string (optional)",
  "focusPreferences": {
    "preferredSessionDuration": "number",
    "preferredBreakDuration": "number",
    "autoStartBreak": "boolean",
    "defaultFocusMode": "pomodoro | stopwatch"
  }
}
```

## 2. Courses Service

### Endpoints
- `GET /courses`: List all courses for the user.
- `POST /courses`: Create a new course.
- `GET /courses/:id`: Get detailed course info (including weekly plan).
- `PATCH /courses/:id`: Update course info.
- `DELETE /courses/:id`: Delete a course.

### Data Structure (Course)
```json
{
  "id": "string",
  "title": "string",
  "code": "string",
  "instructor": "string",
  "credits": "number",
  "status": "current | completed | planned",
  "progress": "number (0-100)",
  "weeklyPlan": [
    {
      "weekNumber": "number",
      "title": "string",
      "studyTasks": [
        { "id": "string", "title": "string", "completed": "boolean" }
      ],
      "assignments": [
        { "id": "string", "title": "string", "dueDate": "ISO8601", "status": "pending|submitted|graded" }
      ]
    }
  ]
}
```

## 3. Tasks Service (Global)

### Endpoints
- `GET /tasks`: List all global tasks.
- `POST /tasks`: Create a new task.
- `PATCH /tasks/:id`: Update task/status.
- `DELETE /tasks/:id`: Delete task.

### Data Structure (TaskItem)
```json
{
  "id": "string",
  "title": "string",
  "type": "assignment | exam | study-task | general",
  "priority": "low | medium | high",
  "status": "todo | in-progress | done",
  "dueDate": "YYYY-MM-DD",
  "dueTime": "HH:mm (optional)"
}
```

## 4. Academic Planning

### Endpoints
- `GET /academic-planning/semesters`: List all semesters.
- `POST /academic-planning/semesters`: Create/Manage multi-semester plan.

## Technical Notes
- **Base URL**: Set in `.env` as `NEXT_PUBLIC_API_URL`.
- **Authentication**: JWT via `Authorization: Bearer <token>` header.
- **Content Type**: `application/json` for all requests.
