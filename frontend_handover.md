# 🤝 StudyFlow Frontend Handover Guide

Welcome to the **StudyFlow** project! This guide is designed to help you, as a backend developer, understand the "how" and "why" of the existing frontend architecture to ensure a smooth integration with your Laravel API.

---

## 🏛 1. The Architecture (Next.js 101)

If you are coming from **Laravel**, here is a quick mapping of concepts:

| Laravel Concept | Next.js Equivalent | Description |
| :--- | :--- | :--- |
| `routes/web.php` | `src/app/` folder structure | Folders are routes. `page.tsx` is the endpoint. |
| `resources/views/layouts` | `layout.tsx` | Persistent wrappers (Sidebar, Header). |
| `Blade @extends` | Layout nesting | Layouts wrap pages automatically by directory. |
| `Controllers` | `src/hooks/` & `src/app/api/` | Logic and state management. |

### Route Groups `(dashboard)`
You will see folders like `(dashboard)`. The `()` mean this folder **does not** appear in the URL. It’s only for organization and to apply a shared layout to multiple pages.

---

## 🧠 2. State Management: The `useAppState` Hook

This is the most important part of the frontend logic. Instead of each page managing its own data, we use a **Global Store**.

### Why `useAppState`?
- **Centralized Logic**: All functions to add courses, update tasks, or start focus sessions live here (`src/hooks/use-app-state.ts`).
- **Data Persistence**: Currently, it uses `localStorage` to simulate a database. 
- **Consistency**: Any change made in one page (e.g., adding a course) is immediately reflected across the entire app (e.g., in the Dashboard stats).

> [!TIP]
> **Your Task**: You will eventually replace the `localStorage` logic inside this hook with `fetch` calls to your Laravel API.

---

## 🏗 3. Component Hierarchy

1.  **UI Components (`src/components/ui`)**: Low-level "Atoms" (Buttons, Inputs, Dialogs) from the design system.
2.  **Shared Components (`src/components/shared`)**: Common patterns used across features (Skeletons, Empty States).
3.  **Feature Components**: Complex modules like Academic Planning or the Focus Engine, organized by domain.

---

## 🌐 4. Backend Integration (The Bridge)

To connect your **Laravel** backend, we have prepared two key files:

### 📡 `src/lib/api-client.ts`
A standardized `fetch` wrapper. It handles:
- Base URL (`NEXT_PUBLIC_API_URL`).
- Automatic `Authorization: Bearer <token>` injection.
- Error handling.

### 🔐 `src/services/auth.service.ts`
The first service you should implement. It handles login, registration, and profile fetching.

### 📝 Data Standards
- We use **TypeScript Interfaces** (`src/types/`) to define the shape of our data.
- **Naming**: Please use `camelCase` for JSON keys in your Laravel responses to match our frontend types.
- **Example**: `first_name` (Laravel) ❌ -> `firstName` (Next.js) ✅.

---

## 🚦 5. Development Workflow

1.  **Environment**: Create a `.env.local` based on `.env.example`. 
    - Set `NEXT_PUBLIC_API_URL=http://your-laravel-api.test/api`.
2.  **Run Server**: `npm run dev`.
3.  **Interactivity**: Ensure your API handles CORS correctly (see `backend_roadmap.md`).

---

## 🛡 6. Avoiding Conflicts

- **Don't delete `useAppState`**: It’s the glue holding the UI together. Just swap the storage logic.
- **Use the Grid**: The UI is built on a responsive 12-column grid. Avoid fixed `px` widths where possible.
- **Zustand/Store**: We use a custom subscription store (`src/lib/store/app-store.ts`) for high performance. It works similarly to Pinia in Vue or Redux in React.

---

### 📞 Contact & Support
If you see a "Server Component" error or a "Hydration" mismatch, don't worry—most of the time it’s just a mismatch between the server-rendered HTML and the client-side state. Reach out for a quick debug session!

**Let's build something great! 🚀**
