import type { IconName } from "@/lib/icons";
import type { MockupVariant } from "@/components/marketing/ProductMockup";

export type Feature = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  headline: string;
  subhead: string;
  icon: IconName;
  mockup: MockupVariant;
  benefits: { title: string; body: string }[];
};

export const features: Feature[] = [
  {
    slug: "document-management",
    name: "Document Management",
    shortName: "Documents",
    tagline: "One manifest, not a folder graveyard",
    headline: "Every client document, versioned and status-tracked",
    subhead:
      "Draft, review, approved — Harbor tracks where every file stands so nobody's chasing 'is this the latest one?' over email again.",
    icon: "doc",
    mockup: "files",
    benefits: [
      {
        title: "A real status workflow",
        body: "Files move through draft → review → approved with a visible tag, so clients and your team agree on what's final without a side conversation.",
      },
      {
        title: "Version history that doesn't disappear",
        body: "Every re-upload keeps the prior version attached to the file, so you can always answer 'what changed since last week.'",
      },
      {
        title: "Watermarking on sensitive files",
        body: "Turn on a watermark per file when a document shouldn't circulate past the person who opened it.",
      },
      {
        title: "Approval requests, not reminder emails",
        body: "Request sign-off on a file and it shows up as a pending approval in the client's portal home — not buried in their inbox.",
      },
    ],
  },
  {
    slug: "file-sharing",
    name: "File Sharing",
    shortName: "File Sharing",
    tagline: "Share exactly what each client should see",
    headline: "Send the right files to the right people, on purpose",
    subhead:
      "Upload once, control who sees it with group-scoped visibility, and hand out a guest link when someone outside the portal needs a single file.",
    icon: "link",
    mockup: "files",
    benefits: [
      {
        title: "Group-scoped visibility",
        body: "Restrict a file to a specific group within a client — legal only sees legal's files, finance only sees finance's, by default, not by discipline.",
      },
      {
        title: "Guest links for one-off sharing",
        body: "Generate a link for someone who doesn't have a portal account yet, without giving them access to anything else.",
      },
      {
        title: "A storage quota you can see",
        body: "Every client workspace shows usage against its plan's quota, so nobody's surprised by a storage conversation later.",
      },
      {
        title: "Drag-and-drop upload, real files",
        body: "Uploads read the real file name and size from the picker — no placeholder metadata, no separate 'finish setting this up' step.",
      },
    ],
  },
  {
    slug: "task-management",
    name: "Task Management",
    shortName: "Tasks",
    tagline: "Work the client can actually see moving",
    headline: "A kanban board your client is invited to, not locked out of",
    subhead:
      "To do, doing, done — both sides of the engagement see the same board, so status updates stop being a meeting agenda item.",
    icon: "tasks",
    mockup: "kanban",
    benefits: [
      {
        title: "Shared kanban, two views",
        body: "The same tasks render as a kanban board or a calendar, so whichever way someone thinks about deadlines, it's already there.",
      },
      {
        title: "Due dates that flag themselves",
        body: "Overdue tasks visibly stand out on the board and the calendar — no separate report to generate.",
      },
      {
        title: "Client-visible progress, not client-editable chaos",
        body: "Clients see the checklist and what's done; your team controls what moves and when.",
      },
      {
        title: "One task list per client",
        body: "Every workspace gets its own board — nothing from one client's engagement bleeds into another's view.",
      },
    ],
  },
  {
    slug: "collaboration",
    name: "Collaboration",
    shortName: "Collaboration",
    tagline: "Your team and your client, same workspace",
    headline: "Group channels for your team, direct threads with each client",
    subhead:
      "Internal channels keep your team's working chatter separate from the client-facing thread — both live in the same portal, neither leaks into the other.",
    icon: "members",
    mockup: "chat",
    benefits: [
      {
        title: "Team channels, client-invisible",
        body: "#general, #claims-team, #renewals — however your team organizes its own conversation, clients never see it.",
      },
      {
        title: "Groups for scoped work",
        body: "Split a client's members into working groups so the right people see the right files and get looped into the right conversations.",
      },
      {
        title: "Everything tied to one workspace",
        body: "Files, tasks, and messages for a client all live in the same place — no separate tool per function of the engagement.",
      },
      {
        title: "Members, not just seats",
        body: "See who's online, who's away, and who on your team can approve what, at a glance.",
      },
    ],
  },
  {
    slug: "client-communication",
    name: "Client Communication",
    shortName: "Messages",
    tagline: "One thread, not a scattered inbox",
    headline: "A direct line to your client that isn't buried in email",
    subhead:
      "Every client contact gets a real 1:1 thread with their account manager — the same conversation, viewed correctly from both sides.",
    icon: "messages",
    mockup: "chat",
    benefits: [
      {
        title: "Perspective-correct threads",
        body: "The exact same conversation renders with your team's messages on the right in Admin, and the client's own messages on the right in their portal — nobody's confused about who said what.",
      },
      {
        title: "Attached to the work, not a separate app",
        body: "Messaging sits next to the files and tasks it's actually about, in the same portal the client already has open.",
      },
      {
        title: "No noise from other clients",
        body: "Each thread is scoped to one workspace — your Aurora Insurance conversation never shows up next to Bright Peak Realty's.",
      },
      {
        title: "A record that outlasts the email chain",
        body: "Conversations stay attached to the client relationship, not to whoever's inbox happened to be cc'd.",
      },
    ],
  },
  {
    slug: "access-permissions",
    name: "Access & Permissions",
    shortName: "Access & Permissions",
    tagline: "Who can see what, decided once",
    headline: "Role-based access that doesn't require a spreadsheet",
    subhead:
      "Owners, client members, and your team each get a defined permission set — and you can grant one person approval rights without changing their role.",
    icon: "key",
    mockup: "members",
    benefits: [
      {
        title: "Three roles, clearly scoped",
        body: "Owner, Client, and Team each have a defined view/upload/invite/manage permission set, visible in one reference table.",
      },
      {
        title: "Approval rights, independent of role",
        body: "Toggle approval permission per person — you don't need to promote someone's whole role just so they can sign off on files.",
      },
      {
        title: "SSO requests land in a queue, not an inbox",
        body: "New sign-ins via SSO wait as a pending request until your team approves them — access is granted on purpose, every time.",
      },
      {
        title: "Personal 2FA, client-controlled",
        body: "Client-side members can turn on their own two-factor authentication from their account settings, independent of workspace-wide policy.",
      },
    ],
  },
  {
    slug: "data-protection-compliance",
    name: "Data Protection & Compliance",
    shortName: "Security",
    tagline: "Policy you can point to, not just promise",
    headline: "Security settings your clients can actually see",
    subhead:
      "2FA, SSO, and watermarking as workspace-wide toggles, backed by an audit trail and compliance badges — not a claim buried in a sales deck.",
    icon: "shield",
    mockup: "security",
    benefits: [
      {
        title: "Workspace-wide security policy",
        body: "Require 2FA, enforce SSO, or force watermarking on every file in a client's workspace with a single toggle.",
      },
      {
        title: "An audit trail, not a promise",
        body: "Every sensitive action is logged with who, what, and when — reviewable per client, not reconstructed after the fact.",
      },
      {
        title: "Compliance you can display",
        body: "Show the standards your portal meets directly in the Security tab, where it's easy for a client's own compliance team to check.",
      },
      {
        title: "A genuine usage log",
        body: "Files, tasks, messages, members, security, integrations, and branding activity all append to a real, filterable usage feed.",
      },
    ],
  },
  {
    slug: "customization",
    name: "Customization",
    shortName: "Branding",
    tagline: "Their portal, wearing your client's colors",
    headline: "White-labeled per client, not per plan tier",
    subhead:
      "Name, domain, primary and accent color, logo — every client's portal reflects their brand the moment they log in, live, with a one-click revert.",
    icon: "branding",
    mockup: "branding",
    benefits: [
      {
        title: "Live branding, not a static skin",
        body: "Edit name, domain, and colors and see the client portal's chrome update immediately — what you preview is what they see.",
      },
      {
        title: "Per-client, persisted",
        body: "Every workspace keeps its own branding independent of every other client's — switching between clients never resets it.",
      },
      {
        title: "Discard reverts to factory defaults",
        body: "If a branding experiment doesn't land, one click restores the client's original settings — no manual undo.",
      },
      {
        title: "Consistent everywhere it shows up",
        body: "The same brand color and name follow through the portal's top bar, buttons, and progress indicators.",
      },
    ],
  },
  {
    slug: "easy-setup-organization",
    name: "Easy Setup & Organization",
    shortName: "Setup",
    tagline: "A new client, fully provisioned in one step",
    headline: "Add a client, get files, tasks, members, and a portal — instantly",
    subhead:
      "Creating a client provisions every data store it needs in one action, and groups let you organize members into scoped working teams from day one.",
    icon: "layers",
    mockup: "groups",
    benefits: [
      {
        title: "One action, fully provisioned",
        body: "Adding a client sets up its files, tasks, members, groups, security policy, and branding together — nothing to configure separately afterward.",
      },
      {
        title: "Groups for how the client actually works",
        body: "Create sub-groups within a client — legal, finance, leadership — and scope file visibility to them without touching permissions per file.",
      },
      {
        title: "Multiple clients, one sidebar",
        body: "Manage every client from a single console; each client's own portal only ever sees their own data.",
      },
      {
        title: "Remove a client cleanly",
        body: "Deleting a client prunes it from every data store at once — no orphaned files, tasks, or members left behind.",
      },
    ],
  },
  {
    slug: "native-integrations",
    name: "Native Integrations",
    shortName: "Integrations",
    tagline: "Connect the tools you already run on",
    headline: "Salesforce, DocuSign, and the rest of your stack, connected",
    subhead:
      "Turn on an integration from a card in the Integrations tab — no separate console, no context switch to configure it.",
    icon: "plug",
    mockup: "integrations",
    benefits: [
      {
        title: "One tab for every connected app",
        body: "See every available integration as a card you can enable or disable, with a short description of what it does.",
      },
      {
        title: "Salesforce sync you can see",
        body: "Once connected, view the linked account, contact, last sync time, and record count directly in the tab — not in a separate admin panel.",
      },
      {
        title: "Per-client control",
        body: "Integrations are configured per workspace, so one client's Salesforce connection is never mixed up with another's.",
      },
      {
        title: "Room to grow the catalog",
        body: "New integrations show up as new cards in the same tab — the pattern doesn't change as the catalog does.",
      },
    ],
  },
  {
    slug: "api-integrations",
    name: "API Integrations",
    shortName: "API",
    tagline: "Build the connection that doesn't exist yet",
    headline: "An API for when the integration you need isn't in the catalog",
    subhead:
      "Everything a native integration can do — files, tasks, members, messages — is reachable the same way programmatically, for the workflows that are yours alone.",
    icon: "code",
    mockup: "api",
    benefits: [
      {
        title: "The same data model, exposed",
        body: "Workspaces, files, tasks, members, and messages are addressable via API the same way they're addressable in the UI — no separate shadow model to learn.",
      },
      {
        title: "Scoped API keys",
        body: "Issue a key scoped to a single client workspace when a workflow only needs access to one account, not your whole console.",
      },
      {
        title: "Webhooks for the events you already track",
        body: "Subscribe to file approvals, new tasks, or new messages, and pipe them into whatever your team already watches.",
      },
      {
        title: "Built for the custom case",
        body: "When a client's internal system needs something the native integrations don't cover, the API is the same door, just unlocked further.",
      },
    ],
  },
  {
    slug: "mobile-app",
    name: "Mobile App",
    shortName: "Mobile",
    tagline: "The same portal, in your client's pocket",
    headline: "A portal your clients can install, not just bookmark",
    subhead:
      "Harbor's client portal installs like a native app on iOS and Android — same files, same tasks, same thread, no separate download from an app store.",
    icon: "mobile",
    mockup: "mobile",
    benefits: [
      {
        title: "Install in one tap",
        body: "Clients add Harbor to their home screen straight from the browser — full-screen, branded, no app-store review cycle standing between an update and their device.",
      },
      {
        title: "Everything that matters, on a small screen",
        body: "Files, tasks, team, and messages all reflow for mobile — clients can approve a file or reply to a thread from their phone, not just check it.",
      },
      {
        title: "Notified when it matters",
        body: "A new message or a pending approval reaches the client the same day it's sent, not the next time they happen to open email.",
      },
      {
        title: "One codebase, every device",
        body: "Because it's the same portal underneath, a feature that ships for desktop is already on mobile — nothing gets a delayed 'mobile version.'",
      },
    ],
  },
];

export function getFeature(slug: string) {
  return features.find((f) => f.slug === slug);
}

export function getAdjacentFeatures(slug: string) {
  const index = features.findIndex((f) => f.slug === slug);
  const prev = features[(index - 1 + features.length) % features.length];
  const next = features[(index + 1) % features.length];
  return { prev, next };
}
