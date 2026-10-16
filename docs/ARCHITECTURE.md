# Architecture & Technology Stack

## 1. Technology stack

| Layer | Technology | Why |
|-------|------------|-----|
| UI library | **React 19** | Required by the project; component model with hooks |
| Build tool / dev server | **Vite 8** | Fast startup and hot reload; the standard way to start a React project |
| Routing | **React Router 7** | One URL per page (list, details, edit…), browser back/forward, links you can share |
| State | React **Context + `useReducer`** | Built into React and enough for one in-memory collection, so no Redux needed |
| Styling | Plain **CSS** with custom properties | No extra dependency; light/dark themes through CSS variables |
| Testing | **Vitest**, **React Testing Library**, **user-event**, **jsdom** | Runs on Vite's config; tests behave the way a user does |
| Coverage | **@vitest/coverage-v8** | Coverage reports |
| Linting | **Oxlint** (with React rules) | Ships with the Vite template; very fast |
| Language | JavaScript (ES2022+, JSX) | |

## 2. High-level structure

```
┌────────────────────────── Browser ──────────────────────────┐
│  main.jsx                                                   │
│   └─ <BrowserRouter>                                        │
│       └─ <ComputersProvider>   ← in-memory state (reducer)  │
│           └─ <App>                                          │
│               ├─ <NavBar>      ← menu                       │
│               └─ <Routes>                                   │
│                   /                 HomePage                │
│                   /computers        ComputersPage           │
│                   /computers/new    AddComputerPage         │
│                   /computers/:id    ComputerDetailsPage     │
│                   /computers/:id/edit EditComputerPage      │
│                   /about            AboutPage               │
│                   *                 NotFoundPage            │
└─────────────────────────────────────────────────────────────┘
```

The code is split into layers:

1. **Pages** (`src/pages`): one component per route. They read from the context, handle navigation and put components together.
2. **Components** (`src/components`): reusable UI pieces: `NavBar`, `ComputerForm`, `ComputerTable`, `StatusBadge`, `ConfirmDialog`.
3. **Hooks** (`src/hooks`): reusable behaviour. `useDeleteConfirmation` holds the confirm-then-delete flow used by two pages.
4. **State** (`src/context`): `ComputersProvider` exposes `computers`, `addComputer`, `updateComputer`, `deleteComputer` and `getComputer`. All changes go through the pure `computersReducer`.
5. **Logic** (`src/utils`): pure functions with no React in them. `validation.js` (rules, normalising, next asset tag), `search.js` (filter and sort), `format.js` (currency, dates, statistics).
6. **Data** (`src/data`): the starting collection and constants (types, statuses, departments).

## 3. Folder layout

```
src/
├── App.jsx                  routes + page layout
├── main.jsx                 entry point (router + provider)
├── index.css                all styles (tokens, layout, components)
├── components/              NavBar, ComputerForm, ComputerTable, StatusBadge, ConfirmDialog
├── context/                 ComputersContext.jsx, computersReducer.js
├── data/                    constants.js, initialComputers.js
├── hooks/                   useDeleteConfirmation.jsx
├── pages/                   Home, Computers, Add, Edit, Details, About, NotFound
├── utils/                   validation.js, search.js, format.js
└── test/                    test setup + renderApp helper
```

## 4. Data flow

```
User action ─► Page handler ─► context action (addComputer / updateComputer / deleteComputer)
                                     │
                                     ▼
                       computersReducer(state, action)  (pure, returns a new array)
                                     │
                                     ▼
                  New state ─► every component using useComputers() re-renders
```

- **Add / update**: `ComputerForm` checks the values with `validateComputer`. If they pass, it cleans them with `normalizeComputer` (trims text, upper-cases identifiers, converts numbers) and calls `onSubmit`. The page dispatches the change and navigates to `/computers` with a success message.
- **Delete**: `useDeleteConfirmation` opens `ConfirmDialog`. Only after the user confirms does it call `deleteComputer`.
- **Search**: the query, filters and sort order are stored in the URL (`?q=…&status=…`). `ComputersPage` works out the visible rows with `filterComputers` and `sortComputers` inside `useMemo`. Values not on the allowed lists fall back to the defaults.

## 5. Key design decisions

| Decision | Reason |
|----------|--------|
| Context + reducer instead of Redux | One collection and three actions; the built-in tools are enough and add no dependencies. |
| Validation as pure functions | Easy to unit test; the same rules can be reused in the Part 2 backend. |
| One form for add and edit | No duplicated fields or validation; editing passes `excludeId` so a record does not clash with its own tag. |
| Filters stored in the URL | Dashboard cards link straight to a filtered list (e.g. `/computers?status=In Repair`), and filters survive back/forward. |
| Native `<dialog>` for confirmation | Built-in focus trapping, Escape to close and backdrop, with no library. |
| Starting data passed in as a prop | Tests can render the app with their own data. |

## 6. Moving to Part 2 (backend)

The context is the only place that touches the data. To connect a REST API, replace the reducer's starting data with a `fetch` on mount and make `addComputer`, `updateComputer` and `deleteComputer` call the API before dispatching. Pages and components do not need to change. The validation rules in `validation.js` should also run on the server.
