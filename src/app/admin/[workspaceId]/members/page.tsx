import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Panel } from "@/components/ui/Panel";
import { Avatar } from "@/components/ui/Avatar";
import { getMembers, getWorkspace } from "@/lib/data/admin";
import { inviteMember, removeMember, setMemberPassword, setMemberRole } from "@/lib/actions/admin";
import type { Member } from "@/generated/prisma";

const statusColor = { ONLINE: "bg-success", AWAY: "bg-brass", OFFLINE: "bg-slate-light" } as const;
const roleOptions = [
  { value: "OWNER", label: "Owner" },
  { value: "CLIENT", label: "Client" },
  { value: "TEAM", label: "Team" },
] as const;

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
          <div key={m.id} className="border-b border-parchment-2 last:border-b-0">
            <div className="flex items-center gap-3 px-[18px] py-3">
              <Avatar initials={initialsOf(m.name)} />
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-ink">{m.name}</div>
                <div className="text-[11.5px] text-slate-light">{m.email}</div>
              </div>
              <form action={setMemberRole} className="flex items-center gap-1.5">
                <input type="hidden" name="workspaceId" value={workspaceId} />
                <input type="hidden" name="memberId" value={m.id} />
                <select
                  name="role"
                  defaultValue={m.role}
                  className="rounded-md border border-border bg-white px-2 py-1 text-[11.5px] font-semibold text-slate outline-none focus:border-brass"
                >
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <button type="submit" className="rounded-md bg-parchment-2 px-2 py-1 text-[11px] font-semibold text-slate hover:bg-parchment">
                  Save
                </button>
              </form>
              <span className="flex items-center gap-1.5 text-[12px] text-slate">
                <span className={`h-1.5 w-1.5 rounded-full ${statusColor[m.status]}`} /> {m.status.toLowerCase()}
              </span>
              <details className="relative">
                <summary className="cursor-pointer list-none text-[11.5px] font-semibold text-teal hover:underline">Set password</summary>
                <form
                  action={setMemberPassword}
                  className="absolute right-0 top-6 z-10 flex items-center gap-2 rounded-lg border border-border bg-white p-2.5 shadow-[0_8px_24px_rgba(16,38,59,0.14)]"
                >
                  <input type="hidden" name="workspaceId" value={workspaceId} />
                  <input type="hidden" name="memberId" value={m.id} />
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="New password"
                    className="w-36 rounded-md border border-border px-2 py-1.5 text-[12.5px] outline-none focus:border-brass"
                  />
                  <button type="submit" className="whitespace-nowrap rounded-md bg-navy px-2.5 py-1.5 text-[11.5px] font-semibold text-white">
                    Save
                  </button>
                </form>
              </details>
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
            <h3 className="font-serif text-[14.5px] font-semibold">Invite a member</h3>
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
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate">Role</label>
              <select
                name="role"
                defaultValue="CLIENT"
                className="rounded-lg border border-border bg-white px-3 py-2 text-[13px] outline-none focus:border-brass"
              >
                {roleOptions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Login password for this member"
                className="rounded-lg border border-border px-3 py-2 text-[13px] outline-none focus:border-brass"
              />
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
