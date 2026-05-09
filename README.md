# MLRR Home Loans — Frontend

A full-featured home loan portal built with React + Vite. The application serves three distinct user roles — **Customer**, **Agent**, and **Admin** — each with their own portal, authentication flow, and dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Routing | React Router v6 |
| Styling | Plain CSS (modular per feature) |
| UI components | React Bootstrap |
| Forms | React Hook Form + Formik |
| Validation | Yup |
| Notifications | react-hot-toast |
| Icons | react-icons (Fi, Fa) |

---

## Project Structure

```
src/
├── modules/
│   ├── admin/          Admin portal pages + login
│   ├── agent/          Agent portal pages + login
│   ├── loan/           Loan types, application form + multi-step components
│   └── user/           Customer dashboard, auth (Login / SignUp), profile
│
├── calculator/         EMI & Eligibility calculators + tab shell
├── contact/            Contact page sections + FAQ + layout
├── components/         Shared reusable components (Header, Footer, ScrollToTop, animations)
├── layouts/            Route wrapper layouts (Main, Admin, Agent)
├── pages/              Public landing page (Home.jsx)
│
├── Styles/             All CSS files (one per feature area)
├── utils/              Auth helpers, data utilities, loan config
├── Validations/        Yup schemas (contact, signup, loan)
└── assets/             Images (logo, hero, login, signup, user, google)
```

---

## Modules

### Customer (`modules/user/`)
- **Login / SignUp** — modal-based auth embedded in the public header
- **UserDashboard** — nested router with sidebar navigation
  - Dashboard overview with stats and quick actions
  - Applications list
  - Document upload table
  - Loan Tracker — repayment progress, Pay EMI (UPI / Card / Net Banking), payment history, pre-payment, loan closure
  - Profile — editable personal info, loan summary, account settings

### Agent (`modules/agent/`)
- **AgentLogin** — standalone login page at `/agent`
- **AgentHeader** — portal nav with profile modal
- **LeadsDetails** — lead cards with stats and monthly targets
- **Applicationsub** — accept / reject pending applications
- **DocumentAction** — verify / reject customer documents with upload support

### Admin (`modules/admin/`)
- **AdminLogin** — standalone login page at `/admin`
- **AdminHeader** — portal header with logout
- **AdminDashboard** — stats cards + loan type configuration table
- **AdminApplications** — applications table with status tabs and approve / reject actions
- **AdminUsers** — users table with status update and remove
- **AdminAgents** — agents table with tier update dropdown and remove

### Loan (`modules/loan/`)
- **LoanTypes** — product cards (Home, Plot, NRI, Renovation, Balance Transfer) + RBI addendum
- **LoanApply** — reads `?type=` param and renders the multi-step form
- **LoanApplicationContainer** — multi-step orchestrator with sidebar checklist and review summary
- **FormField / StepRenderer / StepProgressBar** — reusable form primitives

---

## Routes

| Path | Component | Access |
|---|---|---|
| `/` | Home | Public |
| `/loan-types` | LoanTypes | Public |
| `/apply?type=` | LoanApply | Customer (auth required) |
| `/login` | Login | Public |
| `/contact` | ContactLayout | Public |
| `/calculator/emi` | EmiPage | Public |
| `/calculator/eligibility` | EligibilityPage | Public |
| `/dashboard/*` | UserDashboard | Customer |
| `/agent` | AgentLogin | Public |
| `/agent/dashboard` | LeadsDetails | Agent |
| `/agent/applications` | Applicationsub | Agent |
| `/agent/docaction` | DocumentAction | Agent |
| `/admin` | AdminLogin | Public |
| `/admin/dashboard` | AdminDashboard | Admin |
| `/admin/applications` | AdminApplications | Admin |
| `/admin/users` | AdminUsers | Admin |
| `/admin/agents` | AdminAgents | Admin |

---

## Auth

Authentication is handled client-side via `utils/auth.js` using `localStorage`. Three demo accounts are available:

| Role | Email | Password |
|---|---|---|
| Customer | rahul@gmail.com | rahul123 |
| Agent | agent@mlrr.com | agent123 |
| Admin | admin@mlrr.com | admin123 |

A `ProtectedRoute` component in `App.jsx` guards role-specific routes and redirects to the correct portal on mismatch.

---

## Path Aliases (vite.config.js)

| Alias | Resolves to |
|---|---|
| `@` | `src/` |
| `@components` | `src/components/` |
| `@modules` | `src/modules/` |
| `@calculator` | `src/calculator/` |
| `@contact` | `src/contact/` |
| `@layouts` | `src/layouts/` |
| `@pages` | `src/pages/` |
| `@utils` | `src/utils/` |
| `@validations` | `src/Validations/` |
| `@styles` | `src/Styles/` |
| `@assets` | `src/assets/` |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Key Features

- **Multi-role portal** — separate login pages and dashboards for customers, agents, and admins
- **Multi-step loan application** — 5-step form with sidebar checklist, field validation, and review summary
- **EMI & Eligibility calculators** — interactive range sliders with real-time results
- **Loan Tracker** — full repayment dashboard with simulated payment flow (UPI, card, net banking)
- **Document management** — upload, verify, and reject documents across agent and user portals
- **Admin controls** — tier management for agents, KYC status updates for users, application approval workflow
- **Responsive design** — mobile-friendly layouts across all portals
