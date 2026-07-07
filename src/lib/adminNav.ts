import type { IconName } from "@/lib/icons";

export type AdminNavItem = {
  key: string;
  label: string;
  icon: IconName;
  href: (workspaceId: string) => string;
  enabled: boolean; // wired to real DB reads (Phase 2) vs. placeholder (Phase 3+)
};

export type AdminNavGroup = {
  title: string | null; // null = ungrouped (Overview)
  items: AdminNavItem[];
};

// The IA restructure: prototype's 11 flat tabs regrouped under the 12 capability
// areas from the marketing site. Phase 2 wired up Overview/Files/Tasks; Phase 3
// wired up Members/Groups/Roles/Security/Usage/Integrations/Branding; Phase 4
// wires up Mobile (PWA info) and the /portal Client Portal. Admin's own
// Messages tab (internal team channels) is the one piece left for later.
export const adminNavGroups: AdminNavGroup[] = [
  {
    title: null,
    items: [{ key: "overview", label: "Overview", icon: "overview", href: (id) => `/admin/${id}/overview`, enabled: true }],
  },
  {
    title: "File Sharing & Document Management",
    items: [{ key: "files", label: "Files", icon: "doc", href: (id) => `/admin/${id}/files`, enabled: true }],
  },
  {
    title: "Task Management",
    items: [{ key: "tasks", label: "Tasks", icon: "tasks", href: (id) => `/admin/${id}/tasks`, enabled: true }],
  },
  {
    title: "Client Communication & Collaboration",
    items: [{ key: "messages", label: "Messages", icon: "messages", href: (id) => `/admin/${id}/messages`, enabled: false }],
  },
  {
    title: "Access & Permissions",
    items: [
      { key: "members", label: "Members", icon: "members", href: (id) => `/admin/${id}/members`, enabled: true },
      { key: "roles", label: "Roles & SSO", icon: "key", href: (id) => `/admin/${id}/roles`, enabled: true },
    ],
  },
  {
    title: "Easy Setup & Organization",
    items: [{ key: "groups", label: "Groups", icon: "layers", href: (id) => `/admin/${id}/groups`, enabled: true }],
  },
  {
    title: "Data Protection & Compliance",
    items: [
      { key: "security", label: "Security", icon: "shield", href: (id) => `/admin/${id}/security`, enabled: true },
      { key: "usage", label: "Usage", icon: "activity", href: (id) => `/admin/${id}/usage`, enabled: true },
    ],
  },
  {
    title: "Native & API Integrations",
    items: [{ key: "integrations", label: "Integrations", icon: "plug", href: (id) => `/admin/${id}/integrations`, enabled: true }],
  },
  {
    title: "Customization",
    items: [{ key: "branding", label: "Branding", icon: "branding", href: (id) => `/admin/${id}/branding`, enabled: true }],
  },
  {
    title: "Mobile App",
    items: [{ key: "mobile", label: "Mobile", icon: "mobile", href: (id) => `/admin/${id}/mobile`, enabled: true }],
  },
];
