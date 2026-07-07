import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";
import { storage } from "../src/lib/storage";

// Ported 1:1 from the prototype's seed arrays (harbor-handoff/index.html ~lines 806-1065).
// Demo login for every "team"-role member: password "harbor-demo" (see README).

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Seeded files are fictional, but give them real bytes anyway so Preview/Download
// (added after the seed data was first written) has something to show immediately,
// not just on freshly-uploaded files. PDFs get a minimal-but-real one-pager;
// everything else gets a plain-text placeholder (Preview shows its honest
// "not available" fallback for those extensions, same as it would for a real docx/zip).
function buildDemoFileBytes(name: string): Buffer {
  if (name.toLowerCase().endsWith(".pdf")) {
    const text = `Harbor demo document - ${name}`.replace(/[()\\]/g, "");
    const stream = `BT /F1 20 Tf 72 700 Td (${text}) Tj ET`;

    const header = "%PDF-1.4\n";
    const objects = [
      "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n",
      "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n",
      "3 0 obj<</Type/Page/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/MediaBox[0 0 612 792]/Contents 5 0 R>>endobj\n",
      "4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n",
      `5 0 obj<</Length ${stream.length}>>\nstream\n${stream}\nendstream\nendobj\n`,
    ];

    // Real xref table with byte-accurate offsets — a hand-rolled PDF with a
    // broken/omitted xref renders blank in Chrome's built-in viewer.
    const offsets: number[] = [0];
    let pos = header.length;
    for (const obj of objects) {
      offsets.push(pos);
      pos += obj.length;
    }
    const xrefOffset = pos;

    const xrefLines = offsets
      .map((off, i) => (i === 0 ? "0000000000 65535 f \n" : `${String(off).padStart(10, "0")} 00000 n \n`))
      .join("");

    const pdf =
      header +
      objects.join("") +
      `xref\n0 ${offsets.length}\n${xrefLines}` +
      `trailer<</Size ${offsets.length}/Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF`;

    return Buffer.from(pdf, "utf-8");
  }
  return Buffer.from(`This is a placeholder for the Harbor demo file "${name}" — seeded data, not a real ${name.split(".").pop()} file.`, "utf-8");
}

const workspacesSeed = [
  { id: "aurora", name: "Aurora Insurance", code: "AI", color: "#C08829", plan: "Enterprise", quotaGB: 10 },
  { id: "nb-law", name: "Nordbridge Law", code: "NB", color: "#3D7A5C", plan: "Premium", quotaGB: 5 },
  { id: "meridian", name: "Meridian Capital", code: "MC", color: "#B4553F", plan: "Standard", quotaGB: 2 },
  { id: "wren", name: "Wren & Co Studio", code: "WC", color: "#1F4B4F", plan: "Lite", quotaGB: 1 },
];

const membersSeed: Record<
  string,
  { name: string; email: string; role: "OWNER" | "CLIENT" | "TEAM"; status: "ONLINE" | "AWAY" | "OFFLINE"; canApprove: boolean }[]
> = {
  aurora: [
    { name: "Priya Nair", email: "priya@aurorainsure.com", role: "OWNER", status: "ONLINE", canApprove: true },
    { name: "Tom Wexler", email: "tom@aurorainsure.com", role: "CLIENT", status: "OFFLINE", canApprove: false },
    { name: "You", email: "you@yourfirm.com", role: "TEAM", status: "ONLINE", canApprove: true },
  ],
  "nb-law": [
    { name: "Elena Cho", email: "elena@nordbridgelaw.com", role: "OWNER", status: "ONLINE", canApprove: true },
    { name: "Marcus Yu", email: "marcus@nordbridgelaw.com", role: "CLIENT", status: "AWAY", canApprove: false },
    { name: "You", email: "you@yourfirm.com", role: "TEAM", status: "ONLINE", canApprove: true },
  ],
  meridian: [
    { name: "Dana Cole", email: "dana@meridiancap.com", role: "OWNER", status: "OFFLINE", canApprove: false },
    { name: "You", email: "you@yourfirm.com", role: "TEAM", status: "ONLINE", canApprove: true },
  ],
  wren: [
    { name: "Sana Wren", email: "sana@wrenstudio.co", role: "OWNER", status: "ONLINE", canApprove: true },
    { name: "You", email: "you@yourfirm.com", role: "TEAM", status: "ONLINE", canApprove: true },
  ],
};

const filesSeed: Record<
  string,
  { name: string; code: string; size: string; by: string; date: string; status: "draft" | "review" | "approved" }[]
> = {
  aurora: [
    { name: "Q3 Claims Summary.pdf", code: "DOC-1042", size: "2.4 MB", by: "Priya Nair", date: "Jul 4", status: "approved" },
    { name: "Renewal Policy Draft.docx", code: "DOC-1041", size: "880 KB", by: "You", date: "Jul 3", status: "review" },
    { name: "Underwriting Notes.xlsx", code: "DOC-1038", size: "1.1 MB", by: "Tom Wexler", date: "Jul 2", status: "draft" },
    { name: "Signed W-9.pdf", code: "DOC-1035", size: "310 KB", by: "Priya Nair", date: "Jun 30", status: "approved" },
    { name: "Claims Photos.zip", code: "DOC-1030", size: "14.2 MB", by: "Tom Wexler", date: "Jun 28", status: "draft" },
  ],
  "nb-law": [
    { name: "Engagement Letter v2.pdf", code: "DOC-2094", size: "420 KB", by: "Elena Cho", date: "Jul 5", status: "approved" },
    { name: "Discovery Bundle.zip", code: "DOC-2091", size: "44.8 MB", by: "You", date: "Jul 4", status: "review" },
    { name: "Case Timeline.pdf", code: "DOC-2088", size: "1.6 MB", by: "Marcus Yu", date: "Jul 2", status: "draft" },
  ],
  meridian: [
    { name: "Investor Update — June.pdf", code: "DOC-3021", size: "2.0 MB", by: "Dana Cole", date: "Jul 3", status: "approved" },
    { name: "Cap Table.xlsx", code: "DOC-3018", size: "640 KB", by: "You", date: "Jun 29", status: "review" },
  ],
  wren: [
    { name: "Brand Guidelines v3.pdf", code: "DOC-4012", size: "8.1 MB", by: "You", date: "Jul 5", status: "draft" },
    { name: "Homepage Mockup.fig", code: "DOC-4009", size: "3.3 MB", by: "Sana Wren", date: "Jul 1", status: "approved" },
  ],
};

const tasksSeed: Record<
  string,
  Record<"todo" | "doing" | "done", { title: string; who: string; due: string; overdue?: boolean }[]>
> = {
  aurora: {
    todo: [{ title: "Collect updated COI from client", who: "PN", due: "Jul 9" }],
    doing: [
      { title: "Draft renewal policy language", who: "YO", due: "Jul 8" },
      { title: "Review underwriting notes", who: "TW", due: "Jul 7", overdue: true },
    ],
    done: [{ title: "Send onboarding checklist", who: "YO", due: "Jul 2" }],
  },
  "nb-law": {
    todo: [{ title: "Prepare discovery index", who: "MY", due: "Jul 11" }],
    doing: [{ title: "Client review of engagement letter", who: "EC", due: "Jul 6" }],
    done: [
      { title: "File initial complaint", who: "YO", due: "Jun 27" },
      { title: "Kickoff call notes", who: "YO", due: "Jun 25" },
    ],
  },
  meridian: {
    todo: [{ title: "Prep Q3 investor deck", who: "YO", due: "Jul 14" }],
    doing: [{ title: "Reconcile cap table", who: "DC", due: "Jul 7", overdue: true }],
    done: [],
  },
  wren: {
    todo: [{ title: "Export final logo files", who: "YO", due: "Jul 10" }],
    doing: [{ title: "Revise homepage mockup", who: "SW", due: "Jul 8" }],
    done: [{ title: "Share brand guidelines v2", who: "YO", due: "Jun 30" }],
  },
};

const channelsSeed: Record<string, string[]> = {
  aurora: ["general", "claims-team", "renewals"],
  "nb-law": ["general", "discovery", "billing"],
  meridian: ["general", "investor-relations"],
  wren: ["general", "design-feedback"],
};

const channelMessagesSeed: Record<string, { who: string; text: string; time: string }[]> = {
  aurora: [
    { who: "Priya Nair", text: "Thanks for the quick turnaround on the summary — looks great.", time: "10:02 AM" },
    { who: "You", text: "Glad it's useful! Let me know if you want the breakdown by region too.", time: "10:05 AM" },
    { who: "Priya Nair", text: "Yes please, that'd help for Thursday's review.", time: "10:06 AM" },
  ],
  "nb-law": [
    { who: "Elena Cho", text: "Signed and sent back the engagement letter.", time: "9:14 AM" },
    { who: "You", text: "Perfect, kicking off discovery prep now.", time: "9:20 AM" },
  ],
  meridian: [
    { who: "Dana Cole", text: "Can we push the deck review to Friday?", time: "8:40 AM" },
    { who: "You", text: "Works on our end — I'll update the task due date.", time: "8:44 AM" },
  ],
  wren: [
    { who: "Sana Wren", text: "Loving the new mockup direction!", time: "Yesterday" },
    { who: "You", text: "Great — pushing final export today.", time: "Yesterday" },
  ],
};

const directMessagesSeed: Record<string, Record<string, { who: string; text: string; time: string }[]>> = {
  aurora: {
    "priya@aurorainsure.com": [
      { who: "Priya Nair", text: "Quick one, just between us — any concerns about the renewal terms?", time: "9:12 AM" },
      { who: "You", text: "Nothing major, I'll flag anything before it goes to the wider group.", time: "9:15 AM" },
    ],
    "tom@aurorainsure.com": [],
  },
  "nb-law": { "marcus@nordbridgelaw.com": [] },
  meridian: {},
  wren: { "sana@wrenstudio.co": [] },
};

const pendingRequestsSeed: Record<string, { name: string; email: string; provider: string }[]> = {
  aurora: [{ name: "Jordan Lee", email: "jordan@aurorainsure.com", provider: "Google Workspace SSO" }],
  "nb-law": [],
  meridian: [{ name: "Priya Osei", email: "priya.osei@meridiancap.com", provider: "Microsoft Entra SSO" }],
  wren: [],
};

const groupsSeed: Record<string, { id: string; name: string; members: string[] }[]> = {
  aurora: [
    { id: "g1", name: "Claims Team", members: ["priya@aurorainsure.com", "tom@aurorainsure.com"] },
    { id: "g2", name: "Executives", members: ["priya@aurorainsure.com"] },
  ],
  "nb-law": [{ id: "g1", name: "Discovery Team", members: ["elena@nordbridgelaw.com", "marcus@nordbridgelaw.com"] }],
  meridian: [{ id: "g1", name: "Investor Relations", members: ["dana@meridiancap.com"] }],
  wren: [{ id: "g1", name: "Design Review", members: ["sana@wrenstudio.co"] }],
};

const auditLogSeed: Record<string, { time: string; who: string; action: string; ip: string }[]> = {
  aurora: [
    { time: "Today 10:02", who: "Priya Nair", action: "Approved Q3 Claims Summary.pdf", ip: "82.14.xx.xx" },
    { time: "Today 08:40", who: "Tom Wexler", action: "Downloaded Underwriting Notes.xlsx", ip: "82.14.xx.xx" },
    { time: "Yesterday", who: "You", action: "Invited priya@aurorainsure.com", ip: "203.0.xx.xx" },
    { time: "Jul 2", who: "Tom Wexler", action: "Logged in via SSO", ip: "82.14.xx.xx" },
  ],
  "nb-law": [
    { time: "Today 09:14", who: "Elena Cho", action: "Signed Engagement Letter v2", ip: "91.203.xx.xx" },
    { time: "Yesterday", who: "You", action: "Shared Discovery Bundle", ip: "203.0.xx.xx" },
  ],
  meridian: [
    { time: "Today 08:44", who: "You", action: "Updated task due date", ip: "203.0.xx.xx" },
    { time: "Jul 3", who: "Dana Cole", action: "Approved Investor Update — June", ip: "44.19.xx.xx" },
  ],
  wren: [
    { time: "Yesterday", who: "Sana Wren", action: "Approved Homepage Mockup", ip: "71.12.xx.xx" },
    { time: "Jul 5", who: "You", action: "Uploaded Brand Guidelines v3.pdf", ip: "203.0.xx.xx" },
  ],
};

const usageLogSeed: Record<string, { category: string; user: string; action: string; date: string; time: string }[]> = {
  aurora: [
    { category: "Files", user: "Priya Nair", action: "Viewed Q3 Claims Summary.pdf", date: "Jul 6", time: "10:02 AM" },
    { category: "Files", user: "Tom Wexler", action: "Downloaded Underwriting Notes.xlsx", date: "Jul 6", time: "08:40 AM" },
    { category: "Tasks", user: "You", action: 'Moved "Review underwriting notes" to In progress', date: "Jul 5", time: "4:12 PM" },
    { category: "Messages", user: "Priya Nair", action: "Sent a message in #general", date: "Jul 6", time: "10:02 AM" },
    { category: "Security", user: "You", action: "Enabled two-factor authentication", date: "Jul 4", time: "9:30 AM" },
    { category: "Members", user: "You", action: "Invited priya@aurorainsure.com", date: "Jul 2", time: "11:00 AM" },
    { category: "Integrations", user: "You", action: "Connected Salesforce", date: "Jun 30", time: "2:15 PM" },
    { category: "Files", user: "Tom Wexler", action: "Uploaded Claims Photos.zip", date: "Jun 28", time: "1:05 PM" },
    { category: "Branding", user: "You", action: "Updated accent colour", date: "Jun 27", time: "3:40 PM" },
  ],
  "nb-law": [
    { category: "Files", user: "Elena Cho", action: "Signed Engagement Letter v2", date: "Jul 5", time: "9:14 AM" },
    { category: "Messages", user: "You", action: "Sent a message in #general", date: "Jul 5", time: "9:20 AM" },
    { category: "Tasks", user: "Marcus Yu", action: "Commented on Case Timeline", date: "Jul 3", time: "2:00 PM" },
  ],
  meridian: [
    { category: "Tasks", user: "You", action: 'Created "Prep Q3 investor deck"', date: "Jul 4", time: "8:44 AM" },
    { category: "Files", user: "Dana Cole", action: "Approved Investor Update — June", date: "Jul 3", time: "10:00 AM" },
  ],
  wren: [
    { category: "Files", user: "You", action: "Uploaded Brand Guidelines v3.pdf", date: "Jul 5", time: "3:10 PM" },
    { category: "Files", user: "Sana Wren", action: "Approved Homepage Mockup", date: "Jul 1", time: "11:20 AM" },
  ],
};

const integrationsCatalog = [
  { code: "DS", enabled: false },
  { code: "AS", enabled: false },
  { code: "SF", enabled: true },
  { code: "GW", enabled: false },
  { code: "OD", enabled: false },
  { code: "QB", enabled: true },
  { code: "ZM", enabled: false },
  { code: "PBI", enabled: false },
  { code: "JF", enabled: true },
  { code: "TF", enabled: false },
];

const salesforceSyncSeed: Record<string, { account: string; accountId: string; contact: string; recordsSynced: number }> = {
  aurora: { account: "Aurora Insurance Group", accountId: "001Dn00000AbC1d", contact: "Priya Nair", recordsSynced: 34 },
  "nb-law": { account: "Nordbridge Law LLP", accountId: "001Dn00000XyZ9e", contact: "Elena Cho", recordsSynced: 58 },
  meridian: { account: "Meridian Capital Partners", accountId: "001Dn00000QwR2f", contact: "Dana Cole", recordsSynced: 21 },
  wren: { account: "Wren & Co Studio", accountId: "001Dn00000LmN8g", contact: "Sana Wren", recordsSynced: 0 },
};

const securitySeed: Record<string, { twoFA: boolean; sso: boolean; watermark: boolean }> = {
  aurora: { twoFA: true, sso: false, watermark: true },
  "nb-law": { twoFA: true, sso: true, watermark: false },
  meridian: { twoFA: true, sso: true, watermark: false },
  wren: { twoFA: false, sso: false, watermark: false },
};

function sizeToBytes(size: string): number {
  const [num, unit] = size.split(" ");
  const n = parseFloat(num);
  if (unit === "KB") return Math.round(n * 1024);
  if (unit === "MB") return Math.round(n * 1024 * 1024);
  if (unit === "GB") return Math.round(n * 1024 * 1024 * 1024);
  return Math.round(n);
}

const MONTHS: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

function seedDate(label: string): Date {
  if (label === "Today") return new Date(2026, 6, 7);
  if (label.startsWith("Today")) return new Date(2026, 6, 7);
  if (label === "Yesterday") return new Date(2026, 6, 6);
  const [mon, day] = label.split(" ");
  return new Date(2026, MONTHS[mon] ?? 6, parseInt(day, 10));
}

// Real, elevated-access account (not a demo login) — granted TEAM role +
// approval rights in every workspace, i.e. the highest privilege tier this
// app has (see HANDOFF: TEAM is the ceiling, there's no tier above it).
// Credentials come from the environment, never from source — this file is
// pushed to a public repo, so no real password or hash gets committed.
// Set SUPER_ADMIN_EMAIL/SUPER_ADMIN_NAME/SUPER_ADMIN_PASSWORD in .env (gitignored)
// to enable; the account is skipped if they're unset.
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME ?? "Admin";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

async function main() {
  console.log("Seeding Harbor demo data...");
  const passwordHash = await bcrypt.hash("harbor-demo", 10);
  const superAdminPasswordHash = SUPER_ADMIN_EMAIL && SUPER_ADMIN_PASSWORD ? await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10) : null;

  for (const ws of workspacesSeed) {
    const workspace = await prisma.workspace.create({
      data: { id: ws.id, name: ws.name, code: ws.code, color: ws.color, plan: ws.plan, quotaGB: ws.quotaGB },
    });

    const memberByEmail = new Map<string, string>();
    for (const m of membersSeed[ws.id]) {
      const member = await prisma.member.create({
        data: {
          workspaceId: workspace.id,
          name: m.name,
          email: m.email,
          role: m.role,
          status: m.status,
          canApprove: m.canApprove,
          // Every seeded member can sign in with the same demo password — see README.
          passwordHash,
        },
      });
      memberByEmail.set(m.email, member.id);
    }

    if (superAdminPasswordHash && SUPER_ADMIN_EMAIL) {
      await prisma.member.create({
        data: {
          workspaceId: workspace.id,
          name: SUPER_ADMIN_NAME,
          email: SUPER_ADMIN_EMAIL,
          role: "TEAM",
          status: "ONLINE",
          canApprove: true,
          passwordHash: superAdminPasswordHash,
        },
      });
    }
    // "You" is the account manager shared across every workspace in the prototype;
    // membersSeed repeats the same email per workspace, each becoming its own Member row here
    // (a real firm-wide "You" account spanning workspaces is Phase 3 scope).
    const byName = new Map<string, string>();
    for (const m of membersSeed[ws.id]) byName.set(m.name, memberByEmail.get(m.email)!);
    const initialsOf = (name: string) =>
      name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase();
    const idByInitials = new Map<string, string>();
    for (const m of membersSeed[ws.id]) idByInitials.set(initialsOf(m.name), memberByEmail.get(m.email)!);

    const groupIdByLocalId = new Map<string, string>();
    for (const g of groupsSeed[ws.id] ?? []) {
      const group = await prisma.group.create({ data: { workspaceId: workspace.id, name: g.name } });
      groupIdByLocalId.set(g.id, group.id);
      for (const email of g.members) {
        const memberId = memberByEmail.get(email);
        if (memberId) await prisma.groupMember.create({ data: { groupId: group.id, memberId } });
      }
    }

    for (const f of filesSeed[ws.id] ?? []) {
      const storageKey = await storage.save(`${workspace.id}/${f.code}-${f.name}`, buildDemoFileBytes(f.name));
      await prisma.file.create({
        data: {
          workspaceId: workspace.id,
          name: f.name,
          code: f.code,
          sizeBytes: sizeToBytes(f.size),
          status: f.status.toUpperCase() as "DRAFT" | "REVIEW" | "APPROVED",
          uploadedById: byName.get(f.by) ?? memberByEmail.get("you@yourfirm.com")!,
          createdAt: seedDate(f.date),
          storageKey,
        },
      });
    }

    for (const [column, tasks] of Object.entries(tasksSeed[ws.id] ?? {})) {
      for (const t of tasks) {
        await prisma.task.create({
          data: {
            workspaceId: workspace.id,
            title: t.title,
            column: column.toUpperCase() as "TODO" | "DOING" | "DONE",
            assigneeId: idByInitials.get(t.who) ?? null,
            dueDate: seedDate(t.due),
          },
        });
      }
    }

    const generalMessages = channelMessagesSeed[ws.id] ?? [];
    for (const chName of channelsSeed[ws.id] ?? []) {
      const channel = await prisma.channel.create({ data: { workspaceId: workspace.id, name: chName } });
      if (chName === "general") {
        for (const m of generalMessages) {
          await prisma.message.create({
            data: { channelId: channel.id, authorId: byName.get(m.who)!, text: m.text },
          });
        }
      }
    }

    for (const [email, msgs] of Object.entries(directMessagesSeed[ws.id] ?? {})) {
      const thread = await prisma.directMessageThread.create({ data: { workspaceId: workspace.id, clientEmail: email } });
      for (const m of msgs) {
        await prisma.message.create({ data: { threadId: thread.id, authorId: byName.get(m.who)!, text: m.text } });
      }
    }

    for (const p of pendingRequestsSeed[ws.id] ?? []) {
      await prisma.pendingRequest.create({
        data: { workspaceId: workspace.id, name: p.name, email: p.email, provider: p.provider },
      });
    }

    const sec = securitySeed[ws.id];
    await prisma.securitySettings.create({ data: { workspaceId: workspace.id, ...sec } });

    await prisma.brandingSettings.create({
      data: {
        workspaceId: workspace.id,
        name: ws.name,
        primaryColor: "#10263B",
        accentColor: ws.color,
        domain: `portal.${ws.id.replace(/-/g, "")}.com`,
        defaultName: ws.name,
        defaultPrimaryColor: "#10263B",
        defaultAccentColor: ws.color,
        defaultDomain: `portal.${ws.id.replace(/-/g, "")}.com`,
      },
    });

    for (const i of integrationsCatalog) {
      await prisma.integration.create({ data: { workspaceId: workspace.id, code: i.code, enabled: i.enabled } });
    }

    const sf = salesforceSyncSeed[ws.id];
    await prisma.salesforceSync.create({
      data: {
        workspaceId: workspace.id,
        account: sf.account,
        accountId: sf.accountId,
        contact: sf.contact,
        recordsSynced: sf.recordsSynced,
        lastSyncedAt: new Date(2026, 6, 7),
      },
    });

    for (const a of auditLogSeed[ws.id] ?? []) {
      await prisma.auditEvent.create({
        data: {
          workspaceId: workspace.id,
          memberId: byName.get(a.who) ?? null,
          action: a.action,
          ip: a.ip,
          createdAt: seedDate(a.time.replace(/^Today.*/, "Today")),
        },
      });
    }

    for (const u of usageLogSeed[ws.id] ?? []) {
      await prisma.usageEvent.create({
        data: {
          workspaceId: workspace.id,
          memberId: byName.get(u.user) ?? null,
          category: u.category,
          action: u.action,
          createdAt: seedDate(u.date),
        },
      });
    }

    console.log(`  ✓ ${ws.name}`);
  }

  console.log("\nDone. Team-role members can sign in with password: harbor-demo");
  console.log('e.g. you@yourfirm.com / "harbor-demo"');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
