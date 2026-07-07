// Reference/catalog data — not workspace-scoped, ported 1:1 from the prototype
// (harbor-handoff/index.html ~lines 910-1011).

export const roleDefs = [
  { key: "OWNER", label: "Client Owner", desc: "Primary contact on the client side.", view: true, upload: true, invite: true, manage: false },
  { key: "CLIENT", label: "Client Member", desc: "Client-side collaborator, no billing access.", view: true, upload: true, invite: false, manage: false },
  { key: "TEAM", label: "Team Admin", desc: "Your firm — full internal control.", view: true, upload: true, invite: true, manage: true },
] as const;

export const complianceBadges = [
  { code: "ISO", name: "ISO 27001", sub: "Certified" },
  { code: "SOC2", name: "SOC 2", sub: "Type II" },
  { code: "GDPR", name: "GDPR", sub: "EU compliant" },
  { code: "HIPAA", name: "HIPAA", sub: "Ready" },
  { code: "PCI", name: "PCI", sub: "DSS aligned" },
  { code: "AES", name: "AES-256", sub: "At rest" },
];

export const integrationsCatalog = [
  { code: "DS", name: "DocuSign", desc: "Send documents out for e-signature without leaving Harbor." },
  { code: "AS", name: "Acrobat Sign", desc: "Alternative e-signature workflow for approvals." },
  { code: "SF", name: "Salesforce", desc: "Sync client accounts and contacts two-way with Salesforce." },
  { code: "GW", name: "Google Workspace", desc: "Edit Docs, Sheets, and Slides in place." },
  { code: "OD", name: "Microsoft OneDrive", desc: "Sync files two-way with OneDrive folders." },
  { code: "QB", name: "QuickBooks", desc: "Pull invoice status into a client's workspace." },
  { code: "ZM", name: "Zoom", desc: "Launch and log calls straight from a task." },
  { code: "PBI", name: "Power BI", desc: "Embed live dashboards inside a workspace." },
  { code: "JF", name: "Jotform", desc: "Collect onboarding info with embedded forms." },
  { code: "TF", name: "Typeform", desc: "Drop a styled form into any client workspace." },
];

export const usageCategories = ["Files", "Tasks", "Messages", "Members", "Security", "Integrations", "Branding"] as const;

export const brandingSwatches = {
  primary: ["#10263B", "#1F4B4F", "#7A3B3D", "#3D5A7A"],
  accent: ["#C08829", "#3D7A5C", "#B4553F", "#8B98A3"],
};
