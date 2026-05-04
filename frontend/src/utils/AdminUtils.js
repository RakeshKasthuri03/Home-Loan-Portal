export const admin = {
  name: "Admin User",
  email: "admin@loanportal.com",
  role: "admin",
};

export const adminDashboardData = {
  stats: [
    {
      id: "totalApps",
      title: "Total applications",
      value: "248",
      badge: "+12%",
      badgeColor: "green",
      textColor: "default",
    },
    {
      id: "pending",
      title: "Pending review",
      value: "42",
      badge: "7 new",
      badgeColor: "orange",
      textColor: "orange",
    },
    {
      id: "disbursed",
      title: "Total disbursed",
      value: "₹184 Cr",
      badge: "+8%",
      badgeColor: "green",
      textColor: "green",
    },
    {
      id: "rejected",
      title: "Rejected ",
      value: "14",
      badge: "-3%",
      badgeColor: "red",
      textColor: "red",
    },
  ],
};

export const adminMenuSections = [
  {
    heading: "ADMIN PANEL",
    items: [
      { label: "Dashboard", to: "admin/" },
      { label: "Applications", to: "admin/applications" },
      
    ],
  },
  {
    heading: "PEOPLE",
    items: [
      { label: "Users", to: "admin/users" },
      { label: "Agents", to: "admin/agents" },
    ],
  },
  {
    heading: "REPORTS",
    items: [
      { label: "Analytics", to: "analytics" },
      { label: "Transactions", to: "transactions" },
    ],
  },
];


//application page data

// ============================
// ADMIN APPLICATIONS DATA
// ============================

export const adminApplicationsData = [
  {
    id: "#HLP-0142",
    name: "Rahul Nani",
    loanType: "Home loan",
    amount: "₹50L",
    officer: "Priya S.",
    applied: "Apr 22",
    status: "Review",
  },
  {
    id: "#HLP-0141",
    name: "Ananya Rao",
    loanType: "Plot loan",
    amount: "₹35L",
    officer: "Sundar R.",
    applied: "Apr 21",
    status: "Pending",
  },
  {
    id: "#HLP-0140",
    name: "Vijay Kumar",
    loanType: "Renovation",
    amount: "₹12L",
    officer: "Meena I.",
    applied: "Apr 20",
    status: "Approved",
  },
  {
    id: "#HLP-0139",
    name: "Preethi M.",
    loanType: "NRI loan",
    amount: "₹80L",
    officer: "Priya S.",
    applied: "Apr 19",
    status: "Review",
  },
  {
    id: "#HLP-0138",
    name: "Suresh Raj",
    loanType: "Home loan",
    amount: "₹42L",
    officer: "Sundar R.",
    applied: "Apr 18",
    status: "Rejected",
  },
  {
    id: "#HLP-0137",
    name: "Kavitha N.",
    loanType: "Home loan",
    amount: "₹65L",
    officer: "Meena I.",
    applied: "Apr 17",
    status: "Approved",
  },
];