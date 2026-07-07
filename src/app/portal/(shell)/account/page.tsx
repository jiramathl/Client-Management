import { getCurrentClientMember } from "@/lib/data/portal";
import { togglePersonal2FA } from "@/lib/actions/portal";
import { Avatar } from "@/components/ui/Avatar";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default async function PortalAccountPage() {
  const member = await getCurrentClientMember();
  if (!member) return null;

  return (
    <div className="space-y-4.5">
      <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-[18px]">
        <Avatar initials={initialsOf(member.name)} className="h-12 w-12 text-[15px]" />
        <div>
          <div className="font-serif text-[16px] font-semibold text-ink">{member.name}</div>
          <div className="text-[12.5px] text-slate-light">{member.email}</div>
          <span className="mt-1 inline-block w-fit rounded-full bg-parchment-2 px-2.5 py-0.5 text-[11px] font-semibold text-slate">
            {member.role === "OWNER" ? "Client Owner" : "Client Member"}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="border-b border-border px-[18px] py-3.5 font-serif text-[15px] font-semibold text-ink">Account security</div>
        <div className="flex items-center justify-between px-[18px] py-3.5">
          <div>
            <div className="text-[13.5px] font-semibold text-ink">Two-factor authentication</div>
            <div className="mt-0.5 text-[12px] text-slate-light">Require a second step when you sign in.</div>
          </div>
          <form action={togglePersonal2FA}>
            <input type="hidden" name="nextValue" value={(!member.personal2FA).toString()} />
            <button
              type="submit"
              className="relative h-[22px] w-[38px] rounded-full transition"
              style={{ background: member.personal2FA ? "#3D7A5C" : "#DFD7C6" }}
            >
              <span
                className="absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-all"
                style={{ left: member.personal2FA ? 17 : 3 }}
              />
            </button>
          </form>
        </div>
        <div className="flex items-center justify-between px-[18px] py-3.5">
          <div className="text-[13.5px] font-semibold text-ink">File approval permission</div>
          <span className={`text-[12px] font-semibold ${member.canApprove ? "text-success" : "text-slate-light"}`}>
            {member.canApprove ? "Granted" : "Not granted"}
          </span>
        </div>
      </div>
    </div>
  );
}
