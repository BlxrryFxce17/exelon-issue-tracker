# 🚀 NexusTrack — Enterprise Issue Tracking System
**Technical Assessment Submission for Full Stack Developer at Exelon Circuits**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://exelon-issue-tracker.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/Repository-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/BlxrryFxce17/exelon-issue-tracker)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 🔗 Live Deployment & Source Code

- **🌐 Live Production URL (Vercel)**: [https://exelon-issue-tracker.vercel.app/](https://exelon-issue-tracker.vercel.app/)
- **📁 Source Code (GitHub)**: [https://github.com/BlxrryFxce17/exelon-issue-tracker](https://github.com/BlxrryFxce17/exelon-issue-tracker)

---

## 📌 1. Project Overview

**NexusTrack** is a high-density, production-grade issue tracking and engineering telemetry management application designed specifically for agile software, hardware, and circuits teams at **Exelon Circuits**.

Built with **React 19**, **TypeScript**, and a custom **Linear-inspired design system**, it provides end-to-end issue lifecycle management, real-time status progression across interactive Kanban boards, multi-user assignment workflows, threaded discussions, and a comprehensive engineering telemetry dashboard.

The application is fully client-side persistent (via synchronized `localStorage` state management), requires zero external database setup for evaluation, and includes instant 1-click persona switching to experience the platform from different team perspectives.

---

## ✨ 2. Features & Functional Specifications

All core requirements and advanced capabilities have been implemented:

| Feature Area | Capabilities & Specifications |
| :--- | :--- |
| **1. User Authentication & Personas** | • **1-Click Instant Persona Switcher**: Switch between 6 realistic team roles in the navbar (*Tech Lead, Frontend Dev, Backend Dev, QA Lead, Product Manager, Firmware Engineer*)<br>• **User Registration**: Custom avatar, role, and department assignment<br>• **User Profile**: Personal workload metrics and secure logout workflow |
| **2. Issue Management (CRUD)** | • **Create & Edit**: Title, rich description, category (*Bug, Feature, Task, Improvement, Security*), priority (*Urgent, High, Medium, Low*), assignee, due date, estimated hours, and `#tags`<br>• **Delete**: Safe 2-step confirmation modal with keyboard confirmation<br>• **Bulk Actions**: Multi-select issues for batch status changes or deletion |
| **3. Assignee Workflows** | • Seamless assignment and reassignment with reactive avatar chips<br>• **Team Directory**: Dedicated view showing team workload distribution, open tickets, and resolution metrics |
| **4. Status Tracking (Open, In Progress, Closed)** | • Strict 3-state progression: **Open ➔ In Progress ➔ Resolved (Closed)**<br>• **Interactive Kanban Board**: 3 status columns with real-time issue count badges and quick ticket creation<br>• Confetti particle celebration on ticket resolution 🎉 |
| **5. Discussion & Comments** | • Threaded conversation on every issue with author avatar, role badge, and relative timestamps<br>• Author-only comment deletion<br>• **Activity Audit Trail**: Chronological event log tracking issue transitions, reassignments, and comment events |
| **6. Dashboard with Counts** | • **Executive KPI Cards**: Live counts for Total, Open, In Progress, Closed, Critical/Urgent, and Overdue issues<br>• **Status Breakdown**: Linear-style proportional stacked bar & legend grid<br>• **Severity Distribution**: Proportional priority breakdown<br>• **Team Workload**: Assignee progress bars with resolution percentages<br>• **Category Classification**: Metadata blocks with progress mini-bars |
| **7. OS-Aware Keyboard Shortcuts** | • **Platform Detection**: Automatically detects macOS (`⌘`) vs Windows/Linux (`Ctrl`)<br>• `Ctrl/Cmd + K` or `/`: Focus search input<br>• `C`: Open New Issue modal from anywhere<br>• `1` / `2` / `3` / `4`: Quick-switch views (Overview, Board, Issues, Team)<br>• `?`: Interactive Keyboard Shortcuts cheatsheet |
| **8. Tactile Toast Feedback** | • Non-intrusive bottom-right notifications for ticket creation, edits, status transitions, exports, and clipboard copy |
| **9. Data Portability & Tools** | • **Export as CSV**: Spreadsheet-ready file with UTF-8 Byte Order Mark (`\uFEFF`) for flawless Microsoft Excel support<br>• **Export as JSON**: Full structured database backup<br>• **Reset Demo Data**: 1-click restore to pristine 12-ticket initial state<br>• **1-Click Copy**: Copy issue key (`EX-101`) or markdown link (`[EX-101] Title`) |
| **10. Responsive Design** | • Collapsible icon-only sidebar on screens $\le 768\text{px}$<br>• Horizontally scrollable Kanban board columns on mobile and tablet screens |

---

## 🏗️ 3. Architecture & Tech Stack

### Tech Stack
- **Frontend Framework**: React 19 (`react`, `react-dom`)
- **Language**: TypeScript 5.x (Strict type safety, custom interfaces)
- **Bundler & Build Tool**: Vite 6.x (Lightning-fast HMR and optimized production bundling)
- **Icons**: Lucide React (Tree-shakeable, clean SVGs)
- **Micro-Interactions**: Canvas Confetti (Lightweight celebration effects)
- **Styling**: Vanilla CSS Design System with 50+ semantic tokens (zero Tailwind/Bootstrap bloat, Linear-inspired matte dark/light aesthetic)
- **State Architecture**: React Context API (`AuthContext`, `IssueContext`, `ThemeContext`, `ToastContext`) with reactive `localStorage` synchronization
- **Routing & Hosting**: Vercel Edge Network with `vercel.json` SPA routing

### Directory Architecture
```
src/
├── types/
│   └── index.ts                 # Core TypeScript interfaces (User, Issue, Comment, ActivityLog)
├── data/
│   └── initialData.ts           # 12 realistic engineering issues, 22 comments, 10 activity logs
├── context/
│   ├── AuthContext.tsx           # Multi-user authentication, registration, persona switching
│   ├── IssueContext.tsx          # Issue CRUD, comments, activity logs, filter & search engine
│   ├── ThemeContext.tsx          # Dark / Light theme toggle with local storage persistence
│   └── ToastContext.tsx          # Global tactile toast notification provider
├── components/
│   ├── common/                  # Navbar, Sidebar, Badge, Avatar, Modal, ShortcutsModal
│   ├── dashboard/               # MetricCards, StatusChart, PriorityChart, WorkloadProgress, CategoryBreakdown, ActivityFeed
│   ├── issues/                  # Kanban board, List table, Issue card, Detail modal, Form modal, Filter bar
│   ├── auth/                    # Login modal, Register modal, Profile modal
│   └── team/                    # Team directory and workload analysis view
├── utils/
│   ├── helpers.ts               # Date formatters, CSV/JSON exporters (Blob + UTF-8 BOM), overdue detection
│   └── platform.ts              # OS detection (macOS ⌘ vs Windows/Linux Ctrl)
├── index.css                    # Design system tokens, utilities, and responsive breakpoints
├── App.tsx                      # Root layout, keyboard shortcuts listener, and view router
└── main.tsx                     # Application entry point
```

---

## ⚙️ 4. Environment Variables

NexusTrack is designed to be an entirely self-contained, zero-configuration application that runs client-side with persistent local storage. No secret keys or database credentials are required to run the evaluation.

However, optional configuration variables can be provided via a `.env` or `.env.local` file:

```env
# Application metadata
VITE_APP_TITLE="NexusTrack"
VITE_APP_VERSION="1.2.0"

# Optional backend API endpoint (reserved for external backend microservices)
VITE_API_BASE_URL=""

# Node environment
NODE_ENV="production"
```

---

## 🔌 5. API & Data Layer Details

The client architecture follows an asynchronous, repository-style service layer managed via `IssueContext` and `AuthContext`. All operations mirror standard RESTful HTTP semantics:

### Issue Endpoints (`/api/issues`)
- `GET /issues`: Returns all issues matching active filters (Search, Status, Priority, Category, Assignee).
- `POST /issues`: Creates a new issue (generates unique key `EX-XXX`, timestamps, default audit logs).
- `PUT /issues/:id`: Updates an issue's details, priority, assignee, due date, or tags.
- `PATCH /issues/:id/status`: Transitions issue status (`open` ➔ `in_progress` ➔ `closed`).
- `DELETE /issues/:id`: Permanently deletes an issue with two-step confirmation.

### Comment Endpoints (`/api/issues/:id/comments`)
- `GET /issues/:id/comments`: Retrieves all threaded comments for an issue.
- `POST /issues/:id/comments`: Adds a comment authored by the current authenticated user.
- `DELETE /issues/:id/comments/:commentId`: Deletes a comment (restricted to author).

### Auth & User Endpoints (`/api/users`)
- `POST /auth/login`: Authenticates user credentials or 1-click persona switch.
- `POST /auth/register`: Creates and persists a new user profile with assigned department and role.
- `GET /users`: Retrieves team roster with department and workload metrics.

---

## 🛠️ 6. Local Setup & Installation

Follow these steps to run the project locally on your machine:

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20.x recommended)
- **Package Manager**: `npm`, `yarn`, or `pnpm`

### Installation Steps
```bash
# 1. Clone the repository
git clone https://github.com/BlxrryFxce17/exelon-issue-tracker.git
cd exelon-issue-tracker

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
The server will start at **`http://localhost:5173/`** (or next available port).

### Building for Production
```bash
# Typecheck and build optimized bundle to dist/
npm run build

# Preview production build locally
npm run preview
```

---

## 🚀 7. Deployment Guide (BRD Section)

### Hosting Platform
- **Provider**: **Vercel** Edge Network ([https://vercel.com](https://vercel.com))
- **Live URL**: [https://exelon-issue-tracker.vercel.app/](https://exelon-issue-tracker.vercel.app/)

### Deployment Approach & Architecture
1. **Continuous Integration & Continuous Deployment (CI/CD)**:
   - The repository is linked directly to Vercel via GitHub Git integration.
   - Any push or pull request merge into the `main` branch automatically triggers an isolated build and atomic zero-downtime deployment.
2. **Build Configuration**:
   - **Framework Preset**: Vite
   - **Build Command**: `tsc -b && vite build`
   - **Output Directory**: `dist`
   - **Node.js Version**: 20.x
3. **Single Page Application (SPA) Routing Configuration**:
   The repository includes a root [`vercel.json`](file:///d:/Project/Exelon/vercel.json) ensuring that all client-side routes rewrite to `index.html`:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

### Steps to Deploy or Update the Application

#### Option A: Automatic Git Deployments (Recommended)
1. Push any commits to `origin main`:
   ```bash
   git add -A
   git commit -m "Your update message"
   git push origin main
   ```
2. Vercel automatically detects the push, builds the project, runs type checks, and deploys the new release in under 30 seconds.

#### Option B: Deploying a New Instance to Vercel
1. Fork or clone this repository to your GitHub account.
2. Navigate to **[vercel.com/new](https://vercel.com/new)**.
3. Import `exelon-issue-tracker`.
4. Keep the default build settings (`npm run build`, `dist` directory).
5. Click **Deploy**.

---

## 👤 8. Evaluation Demo Accounts

You can switch between any of these pre-configured team accounts instantly using the **user profile menu** in the top right of the navigation bar:

| Name | Role | Department | Email |
| :--- | :--- | :--- | :--- |
| **Alex Vance** (Default) | Tech Lead | Core Engineering | `alex.vance@exelon.io` |
| **Sarah Chen** | Frontend Developer | Frontend Architecture | `sarah.chen@exelon.io` |
| **Marcus Brody** | Backend Developer | Backend & Infrastructure | `marcus.brody@exelon.io` |
| **Elena Rostova** | QA Lead | Quality Assurance | `elena.rostova@exelon.io` |
| **Priya Patel** | Product Manager | Product Strategy | `priya.patel@exelon.io` |
| **David Kim** | Firmware Engineer | Firmware & Circuits | `david.kim@exelon.io` |

*(Password for all demo accounts: `password123`)*

---

## 📄 9. Submission Checklist

- [x] **User registration / login**: Implemented with multi-persona switching + custom registration modal
- [x] **Create, edit, delete issues**: Complete CRUD with validation & two-step deletion
- [x] **Assign issue to users**: Interactive assignee selector with avatar chips & team view
- [x] **Status tracking**: Open ➔ In Progress ➔ Closed with Kanban boards & bulk updates
- [x] **Comments on issues**: Threaded discussions with author roles & timestamps
- [x] **Dashboard with counts**: Real-time KPI counts, status bar, priority bars, category & team distribution
- [x] **README.md with all BRD requirements**: Overview, features, architecture, tech stack, setup, env vars, API details, and deployment section
- [x] **Remote deployment**: Hosted on Vercel Edge with zero-downtime CI/CD
- [x] **Pristine git repository**: Clean single-commit history without clutter
- [x] **Submission ready**: Prepared for submission to `careers@exeloncircuits.com` before the deadline

---

*Submitted for Round 2 Technical Assessment — Full Stack Developer position at Exelon Circuits.*
