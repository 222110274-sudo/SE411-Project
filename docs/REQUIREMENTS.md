# Requirements

## 1. Scope

AssetHub lets a company's IT staff keep track of its **computers**: what each machine is, who uses it, what state it is in and what it cost. Part 1 covers only the frontend. The data is held in memory as an array of objects. A backend will be written by hand in Part 2.

## 2. Data model: `Computer`

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | number | auto | Unique, assigned by the app |
| `assetTag` | string | yes | Format `PC-0000`, unique (case-insensitive) |
| `serialNumber` | string | yes | Unique (case-insensitive), max 40 characters |
| `brand` | string | yes | Max 40 characters |
| `model` | string | yes | Max 60 characters |
| `type` | enum | yes | Laptop, Desktop, Workstation, Server, Tablet |
| `cpu` | string | no | Max 60 characters |
| `ramGB` | integer | yes | 1 to 100000 |
| `storageGB` | integer | yes | 1 to 100000 |
| `status` | enum | yes | In Use, Available, In Repair, Retired |
| `assignedTo` | string | if status is "In Use" | Max 60 characters |
| `department` | enum | no | Engineering, Finance, Human Resources, IT, Marketing, Sales, Operations |
| `purchaseDate` | date | yes | A real calendar date, not in the future |
| `price` | number (SAR) | yes | 0 to 10,000,000 |
| `notes` | string | no | Max 500 characters |

## 3. Functional requirements

| ID | Requirement | Where it is met |
|----|-------------|-----------------|
| FR-1 | The project is a React application. | Vite + React 19 |
| FR-2 | A menu lets the user move between the app's features. | `NavBar` (Dashboard, Computers, Add Computer, About); collapses into a "Menu" button on small screens |
| FR-3 | **Display**: list all computers with their key fields. | `ComputersPage` table |
| FR-4 | **Display**: show all details of one computer. | `ComputerDetailsPage` |
| FR-5 | **Display**: show inventory statistics (totals per status, value). | `HomePage` dashboard |
| FR-6 | **Add**: create a computer through a validated form. | `AddComputerPage` + `ComputerForm` |
| FR-7 | **Update**: edit an existing computer through the same form. | `EditComputerPage` + `ComputerForm` |
| FR-8 | **Delete**: remove a computer after the user confirms. | `useDeleteConfirmation` + `ConfirmDialog`, from the list and from the details page |
| FR-9 | **Search**: free-text search across asset tag, brand, model, serial, CPU, employee, department, type and status. | `filterComputers` |
| FR-10 | Filter by status and type, and sort by tag, date, price or brand. | `ComputersPage` toolbar |
| FR-11 | Invalid input is rejected with a clear message next to the field. | `validateComputer` |
| FR-12 | After adding, updating or deleting, the user sees a confirmation message. | Success alert on `ComputersPage` |
| FR-13 | An About page shows the team members (name and student ID), reached from the menu. | `AboutPage` |
| FR-14 | Unknown URLs and missing computers show a "Not found" page. | `NotFoundPage` |

## 4. Non-functional requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | **Usability**: consistent layout; required fields are marked; the next asset tag is suggested automatically. |
| NFR-2 | **Responsiveness**: usable from 320 px phones to desktop. On mobile the table turns into cards. |
| NFR-3 | **Accessibility**: every input has a label; errors are linked with `aria-describedby` and announced; keyboard navigation and visible focus; the dialog uses native `<dialog>`. |
| NFR-4 | **Theming**: follows the operating system's light or dark mode. |
| NFR-5 | **Quality**: automated tests cover every functional requirement; lint passes with no warnings. |
| NFR-6 | **Maintainability**: data logic (validation, search, reducer) lives in pure functions separate from the UI, ready to be swapped for API calls in Part 2. |

## 5. Out of scope for Part 1

- Saving data across reloads (no database or backend).
- User accounts, login and per-role permissions.
- Importing or exporting data.
