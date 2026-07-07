import { Icon } from "@/lib/icons";
import { Avatar } from "@/components/ui/Avatar";
import { Tag } from "@/components/ui/Tag";
import { StatCard } from "@/components/ui/StatCard";

export type MockupVariant =
  | "files"
  | "kanban"
  | "chat"
  | "security"
  | "branding"
  | "integrations"
  | "members"
  | "groups"
  | "mobile"
  | "api";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_20px_50px_rgba(16,38,59,0.12)]">
      <div className="flex items-center gap-1.5 border-b border-border bg-parchment px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function FilesMockup() {
  const rows = [
    { name: "Q3 Claims Summary.pdf", meta: "2.4 MB · Priya Nair", status: "approved" as const },
    { name: "Renewal Terms — draft v3.docx", meta: "880 KB · You", status: "review" as const },
    { name: "Policy Schedule.xlsx", meta: "1.1 MB · Aiko Tanaka", status: "draft" as const },
  ];
  return (
    <Frame>
      <div className="mb-3 flex items-center justify-between">
        <div className="font-serif text-sm font-semibold text-ink">Files</div>
        <div className="flex items-center gap-1.5 rounded-lg bg-navy px-3 py-1.5 text-[11px] font-semibold text-white">
          <Icon name="upload" className="h-3.5 w-3.5" /> Upload
        </div>
      </div>
      <div className="divide-y divide-parchment-2 rounded-lg border border-border">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-3 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-parchment text-teal">
              <Icon name="doc" className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-ink">{r.name}</div>
              <div className="text-[11px] text-slate-light">{r.meta}</div>
            </div>
            <Tag status={r.status}>{r.status[0].toUpperCase() + r.status.slice(1)}</Tag>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function KanbanMockup() {
  const cols: { title: string; cards: { title: string; who: string; due: string; overdue?: boolean }[] }[] = [
    { title: "To do", cards: [{ title: "Collect updated COI", who: "PN", due: "Jul 14" }] },
    {
      title: "Doing",
      cards: [
        { title: "Review renewal terms", who: "YO", due: "Jul 9", overdue: true },
        { title: "Schedule kickoff call", who: "AT", due: "Jul 11" },
      ],
    },
    { title: "Done", cards: [{ title: "Send welcome packet", who: "YO", due: "Jul 2" }] },
  ];
  return (
    <Frame>
      <div className="grid grid-cols-3 gap-3">
        {cols.map((col) => (
          <div key={col.title}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate">{col.title}</span>
              <span className="rounded-full bg-parchment-2 px-2 py-0.5 text-[10px] font-semibold text-slate">
                {col.cards.length}
              </span>
            </div>
            <div className="space-y-2">
              {col.cards.map((c) => (
                <div key={c.title} className="rounded-lg border border-border bg-white p-2.5 shadow-soft">
                  <div className="mb-1.5 text-[11.5px] font-semibold leading-tight text-ink">{c.title}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal text-[8px] font-bold text-white">
                        {c.who}
                      </span>
                    </div>
                    <span className={`text-[10px] ${c.overdue ? "font-semibold text-danger" : "text-slate-light"}`}>{c.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function ChatMockup() {
  return (
    <Frame>
      <div className="space-y-3">
        <div className="flex gap-2.5">
          <Avatar initials="PN" className="h-7 w-7 text-[10px]" />
          <div>
            <div className="mb-1 text-[11px] font-semibold text-ink">
              Priya Nair <span className="ml-1.5 font-normal text-slate-light">10:12 AM</span>
            </div>
            <div className="inline-block rounded-tl-none rounded-xl bg-parchment px-3 py-2 text-[12.5px] text-ink">
              Could you resend the updated schedule when you get a chance?
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse gap-2.5">
          <Avatar initials="YO" className="h-7 w-7 text-[10px]" />
          <div className="text-right">
            <div className="mb-1 text-[11px] font-semibold text-ink">
              <span className="mr-1.5 font-normal text-slate-light">10:15 AM</span> You
            </div>
            <div className="inline-block rounded-tr-none rounded-xl bg-navy px-3 py-2 text-[12.5px] text-white">
              Just uploaded it to Files — should be at the top.
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function SecurityMockup() {
  const toggles = [
    { name: "Require two-factor authentication", on: true },
    { name: "Enforce SSO sign-in", on: true },
    { name: "Watermark all files", on: false },
  ];
  return (
    <Frame>
      <div className="mb-3 grid grid-cols-3 gap-2">
        <StatCard num="SOC 2" label="Type II" />
        <StatCard num="GDPR" label="Compliant" />
        <StatCard num="256-bit" label="Encryption" />
      </div>
      <div className="divide-y divide-parchment-2 rounded-lg border border-border">
        {toggles.map((t) => (
          <div key={t.name} className="flex items-center justify-between px-3 py-2.5">
            <span className="text-[12.5px] font-medium text-ink">{t.name}</span>
            <span className={`relative h-[20px] w-[34px] rounded-full ${t.on ? "bg-success" : "bg-border"}`}>
              <span
                className={`absolute top-[3px] h-[14px] w-[14px] rounded-full bg-white shadow transition-all ${t.on ? "left-[17px]" : "left-[3px]"}`}
              />
            </span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function BrandingMockup() {
  return (
    <Frame>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate">Primary</div>
            <div className="flex gap-2">
              {["#10263B", "#1F4B4F", "#7A3B3D", "#3D5A7A"].map((c, i) => (
                <span
                  key={c}
                  className="h-7 w-7 rounded-lg"
                  style={{ background: c, outline: i === 0 ? "2px solid #16232E" : "none", outlineOffset: 2 }}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate">Accent</div>
            <div className="flex gap-2">
              {["#C08829", "#3D7A5C", "#B4553F", "#8B98A3"].map((c, i) => (
                <span
                  key={c}
                  className="h-7 w-7 rounded-lg"
                  style={{ background: c, outline: i === 0 ? "2px solid #16232E" : "none", outlineOffset: 2 }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center gap-2 bg-navy px-3 py-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brass text-[9px] font-bold text-navy">A</span>
            <span className="font-serif text-[12px] font-semibold text-white">Aurora Insurance</span>
          </div>
          <div className="bg-parchment px-3 py-3 text-[10.5px] text-slate">Live preview</div>
        </div>
      </div>
    </Frame>
  );
}

function IntegrationsMockup() {
  const apps = ["Salesforce", "DocuSign", "Slack", "QuickBooks"];
  return (
    <Frame>
      <div className="grid grid-cols-2 gap-2.5">
        {apps.map((a, i) => (
          <div key={a} className="rounded-lg border border-border bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-parchment text-[11px] font-bold text-teal">
                {a[0]}
              </span>
              <span className={`text-[10px] font-semibold ${i < 2 ? "text-success" : "text-slate-light"}`}>
                {i < 2 ? "Connected" : "Connect"}
              </span>
            </div>
            <div className="text-[12px] font-semibold text-ink">{a}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function ApiMockup() {
  return (
    <Frame>
      <div className="rounded-lg bg-navy p-4 font-mono text-[11.5px] leading-relaxed text-parchment">
        <div className="text-brass-soft">POST /v1/workspaces/aurora/files</div>
        <div className="mt-1 text-parchment/70">Authorization: Bearer sk_live_••••••••</div>
        <div className="mt-2">{"{"}</div>
        <div className="pl-3">&quot;name&quot;: &quot;Renewal Terms.pdf&quot;,</div>
        <div className="pl-3">&quot;visibleGroup&quot;: &quot;grp_leadership&quot;</div>
        <div>{"}"}</div>
        <div className="mt-2 text-success">→ 201 Created</div>
      </div>
    </Frame>
  );
}

function MembersMockup() {
  const rows = [
    { name: "Priya Nair", role: "Owner", email: "priya@auroraco.com" },
    { name: "Aiko Tanaka", role: "Client", email: "aiko@auroraco.com" },
    { name: "You", role: "Team", email: "you@harbor.app" },
  ];
  return (
    <Frame>
      <div className="divide-y divide-parchment-2 rounded-lg border border-border">
        {rows.map((r) => (
          <div key={r.email} className="flex items-center gap-3 px-3 py-2.5">
            <Avatar initials={r.name.split(" ").map((n) => n[0]).join("")} className="h-8 w-8 text-[11px]" />
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-ink">{r.name}</div>
              <div className="text-[11px] text-slate-light">{r.email}</div>
            </div>
            <span
              className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                r.role === "Owner" ? "bg-[#FBF0DC] text-[#93670F]" : "bg-parchment-2 text-slate"
              }`}
            >
              {r.role}
            </span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function GroupsMockup() {
  const groups = [
    { name: "Leadership", members: ["PN", "AT"] },
    { name: "Finance", members: ["AT"] },
  ];
  return (
    <Frame>
      <div className="grid grid-cols-2 gap-2.5">
        {groups.map((g) => (
          <div key={g.name} className="rounded-lg border border-border bg-white p-3">
            <div className="mb-2 flex items-center gap-2 text-[12.5px] font-semibold text-ink">
              <Icon name="layers" className="h-4 w-4 text-teal" /> {g.name}
            </div>
            <div className="flex gap-1.5">
              {g.members.map((m) => (
                <Avatar key={m} initials={m} className="h-6 w-6 text-[9px]" />
              ))}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border p-3 text-[11.5px] font-semibold text-brass">
          + New group
        </div>
      </div>
    </Frame>
  );
}

function MobileMockup() {
  return (
    <div className="flex justify-center">
      <div className="w-[220px] overflow-hidden rounded-[28px] border-[6px] border-navy bg-white shadow-[0_20px_50px_rgba(16,38,59,0.18)]">
        <div className="bg-navy px-4 pb-4 pt-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brass text-[10px] font-bold text-navy">A</span>
            <span className="font-serif text-[13px] font-semibold text-white">Aurora Insurance</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-2/3 rounded-full bg-brass" />
          </div>
        </div>
        <div className="space-y-2 p-3">
          {["Files", "Tasks", "Messages"].map((t) => (
            <div key={t} className="flex items-center justify-between rounded-lg border border-border px-2.5 py-2 text-[11.5px] font-medium text-ink">
              {t} <Icon name="arrowRight" className="h-3.5 w-3.5 text-slate-light" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const registry: Record<MockupVariant, () => React.ReactElement> = {
  files: FilesMockup,
  kanban: KanbanMockup,
  chat: ChatMockup,
  security: SecurityMockup,
  branding: BrandingMockup,
  integrations: IntegrationsMockup,
  members: MembersMockup,
  groups: GroupsMockup,
  mobile: MobileMockup,
  api: ApiMockup,
};

export function ProductMockup({ variant }: { variant: MockupVariant }) {
  const Component = registry[variant];
  return <Component />;
}
