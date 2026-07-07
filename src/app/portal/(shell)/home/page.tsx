import Link from "next/link";
import { getClientHome, getCurrentClientMember } from "@/lib/data/portal";
import { approveFileAsClient } from "@/lib/actions/portal";
import { Icon } from "@/lib/icons";

export default async function PortalHomePage() {
  const member = await getCurrentClientMember();
  if (!member) return null;
  const { progress, recentFiles, waitingOnApproval, recentActivity } = await getClientHome(member.workspaceId, member.id);
  const accent = member.workspace.branding?.accentColor ?? "#C08829";

  return (
    <div>
      <div className="mb-5 flex items-center justify-between rounded-[14px] border border-border bg-white p-[22px_24px]">
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink">Welcome back, {member.name.split(" ")[0]}</h2>
          <p className="mt-1 text-[13px] text-slate">Here&apos;s where things stand with {member.workspace.name}.</p>
        </div>
        <div className="w-40 text-center">
          <div className="font-serif text-2xl font-semibold text-ink">{progress}%</div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-parchment-2">
            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: accent }} />
          </div>
          <div className="mt-1 text-[11px] text-slate-light">Tasks complete</div>
        </div>
      </div>

      <div className="grid grid-cols-[1.4fr_1fr] items-start gap-4.5">
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="border-b border-border px-[18px] py-3.5 font-serif text-[14.5px] font-semibold">Recent updates</div>
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center text-[13px] text-slate-light">Nothing yet.</div>
          ) : (
            recentActivity.map((a) => (
              <div key={a.id} className="border-b border-parchment-2 px-[18px] py-3 last:border-b-0">
                <div className="text-[13px] text-ink">
                  <b>{a.member?.name ?? "Someone"}</b> {a.action}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-light">{a.createdAt.toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <div className="border-b border-border px-[18px] py-3.5 font-serif text-[14.5px] font-semibold">Waiting on your approval</div>
          {waitingOnApproval.length === 0 ? (
            <div className="p-8 text-center text-[13px] text-slate-light">Nothing waiting.</div>
          ) : (
            waitingOnApproval.map((f) => (
              <div key={f.id} className="flex items-center justify-between border-b border-parchment-2 px-[18px] py-3 last:border-b-0">
                <div>
                  <div className="text-[13px] font-medium text-ink">{f.name}</div>
                  <div className="text-[11px] text-slate-light">{f.code}</div>
                </div>
                {member.canApprove && (
                  <form action={approveFileAsClient}>
                    <input type="hidden" name="fileId" value={f.id} />
                    <button type="submit" className="rounded-md bg-success px-2.5 py-1.5 text-[11px] font-bold text-white">
                      Approve
                    </button>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4.5 overflow-hidden rounded-xl border border-border bg-white">
        <div className="border-b border-border px-[18px] py-3.5 font-serif text-[14.5px] font-semibold">Recently shared files</div>
        {recentFiles.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-slate-light">No files shared with you yet.</div>
        ) : (
          recentFiles.map((f) => (
            <Link
              key={f.id}
              href={`/portal/files/${f.id}`}
              className="flex items-center gap-3 border-b border-parchment-2 px-[18px] py-3 last:border-b-0 hover:bg-parchment"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-parchment text-teal">
                <Icon name="doc" className="h-4 w-4" />
              </span>
              <span className="text-[13px] text-ink">{f.name}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
