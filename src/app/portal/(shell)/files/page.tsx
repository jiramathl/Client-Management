import Link from "next/link";
import { getClientFiles, getCurrentClientMember } from "@/lib/data/portal";
import { approveFileAsClient } from "@/lib/actions/portal";
import { FileUploadButton } from "@/components/admin/FileUploadButton";
import { Tag } from "@/components/ui/Tag";
import { Icon } from "@/lib/icons";

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

const statusLower = { DRAFT: "draft", REVIEW: "review", APPROVED: "approved" } as const;

export default async function PortalFilesPage() {
  const member = await getCurrentClientMember();
  if (!member) return null;
  const files = await getClientFiles(member.workspaceId, member.id);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border px-[18px] py-3.5">
        <h2 className="font-serif text-[16px] font-semibold text-ink">Files shared with you</h2>
        <FileUploadButton workspaceId={member.workspaceId} />
      </div>
      {files.length === 0 ? (
        <div className="p-10 text-center text-[13px] text-slate-light">No files visible to you yet.</div>
      ) : (
        files.map((f) => (
          <div key={f.id} className="flex items-center gap-3 border-b border-parchment-2 px-[18px] py-3 text-[13px] last:border-b-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-parchment text-teal">
              <Icon name="doc" className="h-4 w-4" />
            </span>
            <Link href={`/portal/files/${f.id}`} className="flex-1 hover:underline">
              <div className="font-medium text-ink">{f.name}</div>
              <div className="text-[11px] text-slate-light">
                {formatBytes(f.sizeBytes)} · {f.uploadedBy?.name ?? "Unknown"}
              </div>
            </Link>
            <Tag status={statusLower[f.status]}>{statusLower[f.status][0].toUpperCase() + statusLower[f.status].slice(1)}</Tag>
            {f.approvalRequested && member.canApprove && (
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
  );
}
