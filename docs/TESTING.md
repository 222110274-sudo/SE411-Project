# Testing

## How to run

```bash
npm test                 # run all tests once
npm run test:watch       # re-run on file changes
npm run test:coverage    # run with a coverage report
```

## Strategy

| Level | What is tested | Files |
|-------|----------------|-------|
| **Unit** | Pure logic: validation rules, normalising, asset tag generation, date checks, search and filters, sorting, reducer actions | `src/utils/*.test.js`, `src/context/computersReducer.test.js` |
| **Integration** | The whole app rendered in a test router: menu navigation, display, search, add, update, delete, About page, not-found | `src/App.test.jsx` |

Integration tests use **React Testing Library** with **user-event** and act the way a user does: they find elements by role and label, type into fields and click buttons. Each test renders the app with a fresh copy of the starting data, so tests do not affect each other.

## Requirement coverage

| Requirement | Tests |
|-------------|-------|
| FR-2 Menu | "shows all menu items", "navigates between pages" |
| FR-3/4/5 Display | "displays all computers in a table", "shows the details of a computer", "shows inventory statistics" |
| FR-6 Add | "adds a new computer and shows it in the list", "cancel returns to the list without saving" |
| FR-7 Update | "edits an existing computer", "cancel goes back to the computer details" |
| FR-8 Delete | "deletes a computer after confirmation", "keeps the computer when the user cancels", "deletes from the details page…" |
| FR-9/10 Search | "filters the list as the user types", "filters by status and can clear filters", "reads the status filter from the URL", "ignores unknown filter values in the URL", plus unit tests in `search.test.js` |
| FR-11 Validation | "shows validation errors…", "clears an error once the field is fixed", "prevents using another computer's asset tag", plus 26 unit tests in `validation.test.js` |
| FR-13 About | "lists every team member with their student ID" |
| FR-14 Not found | "shows a not-found page for unknown URLs", "shows not-found when editing a missing computer" |

## Results

```
 Test Files  4 passed (4)
      Tests  61 passed (61)
```

Coverage (`npm run test:coverage`):

| | Statements | Branches | Functions | Lines |
|-|-----------|----------|-----------|-------|
| All files | 93.7% | 91.4% | 91.0% | 95.8% |

The lines not covered are mainly the mobile menu toggle and the dialog's Escape-key handler. Both were checked by hand in a browser.

## Manual checks

Each page was opened in Chromium at desktop (1280 px) and phone (390 px) widths, with no console errors. Screenshots are in [`docs/screenshots`](screenshots).
