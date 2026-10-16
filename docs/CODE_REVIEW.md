# Code Review

An AI assistant (Claude Code) reviewed the Part 1 codebase for **security, performance, code quality and code reuse**. Each finding below is either **Fixed** (changed in the code, with a test added where it makes sense) or **Recommendation** (accepted for Part 1, to address later).

**Summary:** the code is in good shape for a client-only app. The review found 4 bugs, all fixed with regression tests. There were no security vulnerabilities. The remaining items are improvements that become relevant once Part 2 adds a backend.

---

## 1. Security

| # | Finding | Status |
|---|---------|--------|
| S-1 | **No XSS risk.** All user input is shown through JSX, which escapes it. The code never uses `dangerouslySetInnerHTML`, `eval` or `innerHTML`. | ✅ OK |
| S-2 | **URL parameters were trusted.** `?status=`, `?type=` and `?sort=` were used as-is, so a hand-edited URL put the page in a broken state: the dropdown said "All" but no rows were shown. Values are now checked against the allowed lists and fall back to the defaults (`pick()` in `ComputersPage.jsx`). Test: *"ignores unknown filter values in the URL"*. | ✅ Fixed |
| S-3 | **Input validation.** Every field has type, format, range and length checks (`validateComputer`). Asset tags and serial numbers are unique regardless of case. Lengths are capped so oversized input can't slow the UI. | ✅ OK |
| S-4 | **Validation only runs in the browser.** Anyone can bypass client-side checks. In Part 2 the backend must run the same rules again. They are pure functions in `validation.js`, so they are easy to port. | 📌 Recommendation (Part 2) |
| S-5 | **Dependencies.** `npm audit` reports **0 vulnerabilities**. The only runtime dependencies are React, React DOM and React Router. | ✅ OK |
| S-6 | **No authentication or authorisation.** Anyone with the app can change any record. This is acceptable for Part 1. Part 2 should add login and server-side permission checks (e.g. only IT staff may delete). | 📌 Recommendation (Part 2) |
| S-7 | **No secrets in the code.** There are no API keys, tokens or credentials in the repository. | ✅ OK |

## 2. Performance

| # | Finding | Status |
|---|---------|--------|
| P-1 | Filtering and sorting are memoised with `useMemo` and only re-run when the data, query, filters or sort order change. | ✅ OK |
| P-2 | The context value is memoised and the action functions are stable (`useCallback`), so consumers re-render only when the data changes. | ✅ OK |
| P-3 | Search runs on every keystroke and is O(n × fields). That is instant for hundreds of records. With thousands, add a ~200 ms debounce or move search to the server in Part 2. | 📌 Recommendation |
| P-4 | The whole table is rendered at once. For very large inventories, add pagination (preferably on the server in Part 2) or row virtualisation. | 📌 Recommendation |
| P-5 | `getComputer` uses `Array.find` (O(n)). That is fine here. A `Map` keyed by id would make lookups O(1) for large collections. | 📌 Recommendation |
| P-6 | Production bundle: ~287 kB JS (≈90 kB gzipped) and ~10 kB CSS. Pages could be lazy-loaded with `React.lazy` if the app grows. | ✅ OK |

## 3. Code quality and correctness

| # | Finding | Status |
|---|---------|--------|
| Q-1 | **Impossible dates were accepted.** `Date.parse('2024-02-31')` returns a valid timestamp in V8 because it rolls over to 2 March, so the form accepted 31 February. Replaced with `isValidISODate()`, which checks the date round-trips. Tests: *isValidISODate accepts/rejects…* | ✅ Fixed |
| Q-2 | **Old success message after reload.** The "PC-0013 was added" message was passed through router history state. Browsers keep history state on reload, but the in-memory data resets, so the message described a computer that no longer existed. The page now copies the message into local state and clears it from history. | ✅ Fixed |
| Q-3 | **Cancel on the edit page could leave the app.** It used `navigate(-1)`, which goes to whatever page came before, possibly outside the app if the edit URL was opened directly. It now goes to that computer's details page. Test: *"cancel goes back to the computer details"*. | ✅ Fixed |
| Q-4 | **Layers kept separate.** Validation, search, formatting and the reducer are pure functions with no React imports, so they can be unit tested on their own. | ✅ OK |
| Q-5 | **Reducer is immutable** and throws on unknown actions, so mistakes surface immediately instead of being silently ignored. | ✅ OK |
| Q-6 | **Accessibility.** Every input has a `<label>`; invalid fields get `aria-invalid` and `aria-describedby`; focus moves to the first invalid field on submit; the menu has `aria-label` and `aria-expanded`; action buttons have specific labels (e.g. "Delete PC-0003"). | ✅ OK |
| Q-7 | Each field error uses `role="alert"`. If many fields fail at once, screen readers read every error. A single summary alert at the top of the form would be less noisy. | 📌 Recommendation |
| Q-8 | There is no React error boundary. An unexpected rendering error would leave a blank page. Add an `ErrorBoundary` around `<Routes>`. | 📌 Recommendation |
| Q-9 | Lint (`oxlint` with React rules) passes with **0 warnings**. | ✅ OK |
| Q-10 | Converting to TypeScript, or adding JSDoc types to the `Computer` model, would catch field-name typos at build time. | 📌 Recommendation |

## 4. Code reuse

| # | Finding | Status |
|---|---------|--------|
| R-1 | **One form for add and edit.** `ComputerForm` takes `initialValues`, `excludeId` and `submitLabel`, so the fields and validation exist in one place only. | ✅ OK |
| R-2 | **Shared delete flow.** The confirm-then-delete logic (dialog state, message, calling the context) is in the `useDeleteConfirmation` hook and used by both the list and the details page. | ✅ OK |
| R-3 | **Shared presentation helpers.** `StatusBadge`, `statusSlug`, `formatPrice`, `formatDate` and `formatStorage` are used by the dashboard, table and details page instead of repeating the code. | ✅ OK |
| R-4 | **One source for constants.** Types, statuses and departments are defined once in `constants.js` and used by the form, filters, validation and dashboard. | ✅ OK |
| R-5 | **Test helper.** `renderApp(route, data)` sets up the router and provider for every integration test. | ✅ OK |
| R-6 | `ComputersPage` and `HomePage` both build a "page header" block (title, subtitle, action button). A small `PageHeader` component would remove that repetition. | 📌 Recommendation |

---

## Verification after fixes

```
npm run lint   → 0 warnings, 0 errors
npm test       → 61 passed (61)
npm run build  → ✓ built
npm audit      → found 0 vulnerabilities
```
