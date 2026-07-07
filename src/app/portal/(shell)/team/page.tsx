import { getClientTeam, getCurrentClientMember } from "@/lib/data/portal";
import { Avatar } from "@/components/ui/Avatar";
import type { Member } from "@/generated/prisma";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function TeamSection({ title, list }: { title: string; list: Member[] }) {
  return (
    <div className="mb-4.5 overflow-hidden rounded-xl border border-border bg-white">
      <div className="border-b border-border px-[18px] py-3.5 font-serif text-[15px] font-semibold text-ink">{title}</div>
      {list.map((m) => (
        <div key={m.id} className="flex items-center gap-3 border-b border-parchment-2 px-[18px] py-3 last:border-b-0">
          <Avatar initials={initialsOf(m.name)} />
          <div>
            <div className="text-[13px] font-semibold text-ink">{m.name}</div>
            <div className="text-[11.5px] text-slate-light">{m.email}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function PortalTeamPage() {
  const member = await getCurrentClientMember();
  if (!member) return null;
  const { accountTeam, organization } = await getClientTeam(member.workspaceId);

  return (
    <div>
      <TeamSection title="Your account team" list={accountTeam} />
      <TeamSection title="Your organization" list={organization} />
    </div>
  );
}
