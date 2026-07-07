import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Panel } from "@/components/ui/Panel";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/lib/icons";
import { getGroups, getMembers, getWorkspace } from "@/lib/data/admin";
import { addMemberToGroup, createGroup, deleteGroup, removeMemberFromGroup } from "@/lib/actions/admin";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default async function GroupsPage(props: PageProps<"/admin/[workspaceId]/groups">) {
  const { workspaceId } = await props.params;
  const [workspace, groups, members] = await Promise.all([getWorkspace(workspaceId), getGroups(workspaceId), getMembers(workspaceId)]);
  if (!workspace) return null;

  return (
    <>
      <AdminTopbar eyebrow={workspace.name} title="Groups" />
      <div className="flex-1 p-7">
        <div className="grid grid-cols-2 gap-4">
          {groups.map((g) => {
            const memberIds = new Set(g.members.map((gm) => gm.memberId));
            const available = members.filter((m) => !memberIds.has(m.id));
            return (
              <Panel key={g.id}>
                <div className="flex items-center justify-between border-b border-border px-[18px] py-3.5">
                  <h3 className="flex items-center gap-2 font-serif text-[14.5px] font-semibold">
                    <Icon name="layers" className="h-4 w-4 text-teal" /> {g.name}
                  </h3>
                  <form action={deleteGroup}>
                    <input type="hidden" name="workspaceId" value={workspaceId} />
                    <input type="hidden" name="groupId" value={g.id} />
                    <button type="submit" className="text-[11.5px] font-semibold text-danger hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
                <div className="space-y-1.5 p-[18px]">
                  {g.members.length === 0 && <div className="text-[12.5px] text-slate-light">No members yet.</div>}
                  {g.members.map((gm) => (
                    <div key={gm.memberId} className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-parchment">
                      <Avatar initials={initialsOf(gm.member.name)} className="h-6 w-6 text-[9.5px]" />
                      <span className="flex-1 text-[12.5px] text-ink">{gm.member.name}</span>
                      <form action={removeMemberFromGroup}>
                        <input type="hidden" name="workspaceId" value={workspaceId} />
                        <input type="hidden" name="groupId" value={g.id} />
                        <input type="hidden" name="memberId" value={gm.memberId} />
                        <button type="submit" className="text-slate-light hover:text-danger">
                          <Icon name="x" className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
                {available.length > 0 && (
                  <form action={addMemberToGroup} className="flex items-center gap-2 border-t border-parchment-2 p-[18px]">
                    <input type="hidden" name="workspaceId" value={workspaceId} />
                    <input type="hidden" name="groupId" value={g.id} />
                    <select name="memberId" className="flex-1 rounded-lg border border-border px-2.5 py-1.5 text-[12.5px]" defaultValue="">
                      <option value="" disabled>
                        Add a member…
                      </option>
                      {available.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="rounded-lg bg-navy px-3 py-1.5 text-[12px] font-semibold text-white">
                      Add
                    </button>
                  </form>
                )}
              </Panel>
            );
          })}

          <form action={createGroup}>
            <input type="hidden" name="workspaceId" value={workspaceId} />
            <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[10px] border border-dashed border-border p-6">
              <input
                name="name"
                required
                placeholder="New group name"
                className="w-full rounded-lg border border-border px-3 py-2 text-center text-[13px] outline-none focus:border-brass"
              />
              <button type="submit" className="rounded-lg bg-brass px-4 py-2 text-[12.5px] font-semibold text-navy">
                Create group
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
