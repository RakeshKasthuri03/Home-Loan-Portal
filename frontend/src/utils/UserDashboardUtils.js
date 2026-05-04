/* =========================
   USER DATA
========================= */

export const user = {
  name: "Visthargalla Manohar",
  email: "manohar@gmail.com",
  role: "user",
};

export const dashboardData = {
  user: {
    name: "Manohar",
  },
  stats: [
    {
      title: "Total applications",
      value: "5",
      note: "All time",
    },
    {
      title: "Under review",
      value: "2",
      note: "Awaiting officer",
    },
    {
      title: "Approved amount",
      value: "₹50,00,000",
      note: "Home loan",
      color: "green",
    },
    {
      title: "Docs pending",
      value: "3",
      note: "Upload required",
      color: "red",
    },
  ],
  activeApplication: {
    id: "HLP-2025-00142",
    amount: "₹50,00,000",
    loanType: "Home loan",
    officer: "Priya Sharma",
    agent: "Karthik Patel",
    steps: [
      { label: "Submitted", status: "done" },
      { label: "Docs verified", status: "done" },
      { label: "Credit check", status: "current", step: 3 },
      { label: "Sanction", step: 4 },
      { label: "Disbursal", step: 5 },
    ],
  },
  activities: [
    "🔵 Credit assessment started — Today 9:14 AM",
    "✅ Documents verified — Apr 23 · 2:15 PM",
    "🔴 Bank statement upload pending — Apr 23",
    "✅ Application submitted — Apr 22",
  ],
};

/* =========================
   USER MENU (SIDEBAR)
========================= */

export const userMenuSections = [
  {
    heading: "MAIN",
    items: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "My applications", to: "/dashboard/applications", badge: "2" },
      { label: "My documents", to: "/dashboard/mydocuments", badge: "1" },
      { label: "Loan tracker", to: "/dashboard/loan-tracker" },
    ],
  },
  {
    heading: "ACCOUNT",
    items: [
      { label: "My profile", to: "/dashboard/profile" },
    ],
  },
];
/* =========================
   USER PROFILE
========================= */

export const userProfile = {
  firstName: "Manohar",
  lastName: "Visthargalla",
  email: "manohar.visthargalla@email.com",
};



/* ==================================================
   ================== ADMIN DATA =====================
================================================== */

/* =========================
   ADMIN MENU (SIDEBAR)
========================= */
