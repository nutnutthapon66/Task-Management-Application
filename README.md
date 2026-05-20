# Task Management Application

Kanban-style task management app built with Vue 3 + TypeScript. Tasks move across **Todo → In Progress → Done** columns via drag-and-drop, with filters, sorting, and full CRUD support.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Vue 3 (Composition API) |
| Language | TypeScript 6 |
| UI | Vuetify 3 + Tailwind CSS |
| State | Pinia |
| Routing | Vue Router 5 |
| HTTP | Axios + custom `HttpRequest` provider |
| Drag & Drop | vuedraggable 4 |
| Mock API | MSW 2 |
| Date | Day.js |
| Build | Vite 8 |
| Test | Vitest + Vue Test Utils |

## Project Structure

```
src/
├── assets/          # Global CSS, design tokens (light/dark)
├── components/
│   ├── kanban/      # KanbanColumn, KanbanToolbar
│   ├── tasks/       # TaskItem, TaskList, TaskForm, TaskFilter, TaskDialog
│   └── ui/          # StatCard, ConfirmDialog, NotificationToast
├── composables/     # useTheme
├── mocks/           # MSW handlers + in-memory db
├── models/
│   └── enums/       # taskStatus, taskPriority (const + as const pattern)
├── plugins/         # Vuetify, Day.js
├── resources/
│   ├── HttpRequest.ts
│   ├── Interceptors.ts
│   └── provider/    # Task.provider.ts
├── router/
├── stores/          # useTaskStore, useNotificationStore
└── views/           # BoardView
```

## Local Development

Requires Node `22.12.0+` (or `20.19.0+`).

```bash
npm install
cp .env.example .env.local
npm run dev
```

`VITE_API_BASE_URL` ว่างไว้ → ใช้ MSW mock API อัตโนมัติ ไม่ต้องมี backend

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Base URL ของ API จริง ถ้าไม่ set จะใช้ MSW |
| `VITE_USE_MSW` | `true` | บังคับเปิด/ปิด MSW |

```bash
# .env.local ตัวอย่าง
VITE_API_BASE_URL=https://your-api.example.com/api
VITE_USE_MSW=false
```

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build → dist/
npm run preview    # preview production build
npm run test       # run unit tests
npm run lint       # ESLint
npm run format     # Prettier
```

## Adding a New Provider

สร้างไฟล์ใน `src/resources/provider/` แล้ว extends `HttpRequest`:

```ts
import HttpRequest from '../HttpRequest'

class FooProvider extends HttpRequest {
  private urlPrefix = '/foo'

  async getAll(): Promise<Foo[]> {
    return this.get(this.urlPrefix)
  }
}

export default FooProvider
```

## Adding a New Enum

สร้างไฟล์ใน `src/models/enums/` ตาม pattern `const + as const`:

```ts
export const FooStatus = {
  ACTIVE:   'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const

export type FooStatus = (typeof FooStatus)[keyof typeof FooStatus]
```

Re-export ใน `src/models/enums/index.ts`

## Netlify Deploy

```bash
npm run build
netlify deploy --prod  # publish directory: dist
```

หรือเชื่อม GitHub repo กับ Netlify — ระบบจะอ่านค่าจาก `netlify.toml` อัตโนมัติ

SPA fallback routing จัดการโดย `public/_redirects`:

```
/* /index.html 200
```
