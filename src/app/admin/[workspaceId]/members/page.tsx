import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Panel } from "@/components/ui/Panel";
import { Avatar } from "@/components/ui/Avatar";
import { getMembers, getWorkspace } from "@/lib/data/admin";
import { inviteMember, removeMember } from "@/lib/actions/admin";
import type { Member } from "@/generated/prisma";

const statusColor = { ONLINE: "bg-success", AWAY: "bg-brass", OFFLINE: "bg-slate-light" } as const;

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function MemberSection({ title, list, workspaceId }: { title: string; list: Member[]; workspaceId: string }) {
  return (
    <Panel className="mb-5">
      <div className="border-b border-border px-[18px] py-3.5">
        <h3 className="font-serif text-[14.5px] font-semibold">{title}</h3>
      </div>
      {list.length === 0 ? (
        <div className="p-8 text-center text-[13px] text-slate-light">Nobody here yet.</div>
      ) : (
        list.map((m) => (
          <div key={m.id} className="flex items-center gap-3 border-b border-parchment-2 px-[18px] py-3 last:border-b-0">
            <Avatar initials={initialsOf(m.name)} />
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-ink">{m.name}</div>
              <div className="text-[11.5px] text-slate-light">{m.email}</div>
            </div>
            <span
              className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${m.role === "OWNER" ? "bg-[#FBF0DC] text-[#93670F]" : "bg-parchment-2 text-slate"}`}
            >
              {m.role === "OWNER" ? "Owner" : m.role === "CLIENT" ? "Client" : "Team"}
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-slate">
              <span className={`h-1.5 w-1.5 rounded-full ${statusColor[m.status]}`} /> {m.status.toLowerCase()}
            </span>
            {m.role !== "TEAM" && (
              <form action={removeMember}>
                <input type="hidden" name="workspaceId" value={workspaceId} />
                <input type="hidden" name="memberId" value={m.id} />
                <button type="submit" className="text-[11.5px] font-semibold text-danger hover:underline">
                  Remove
                </button>
              </form>
            )}
          </div>
        ))
      )}
    </Panel>
  );
}

export default async function MembersPage(props: PageProps<"/admin/[workspaceId]/members">) {
  const { workspaceId } = await props.params;
  const [workspace, members] = await Promise.all([getWorkspace(workspaceId), getMembers(workspaceId)]);
  if (!workspace) return null;

  const team = members.filter((m) => m.role === "TEAM");
  const clientMembers = members.filter((m) => m.role !== "TEAM");

  return (
    <>
      <AdminTopbar eyebrow={workspace.name} title="Members" />
      <div className="flex-1 p-7">
        <MemberSection title="Your team" list={team} workspaceId={workspaceId} />
        <MemberSection title="Client members" list={clientMembers} workspaceId={workspaceId} />

        <Panel>
          <div className="border-b border-border px-[18px] py-3.5">
            <h3 className="font-serif text-[14.5px] font-semibold">Invite a client member</h3>
          </div>
          <form action={inviteMember} className="flex flex-wrap items-end gap-3 p-[18px]">
            <input type="hidden" name="workspaceId" value={workspaceId} />
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate">Name</label>
              <input name="name" required className="rounded-lg border border-border px-3 py-2 text-[13px] outline-none focus:border-brass" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate">Email</label>
              <input name="email" type="email" required className="rounded-lg border border-border px-3 py-2 text-[13px] outline-none focus:border-brass" />
            </div>
            <button type="submit" className="rounded-lg bg-navy px-4 py-2 text-[13px] font-semibold text-white">
              Invite
            </button>
          </form>
        </Panel>
      </div>
    </>
  );
}
