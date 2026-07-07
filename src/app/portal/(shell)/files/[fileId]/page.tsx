import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { Tag } from "@/components/ui/Tag";
import { FilePreview } from "@/components/FilePreview";
import { Icon } from "@/lib/icons";
import { getFileKind } from "@/lib/fileKind";
import { getClientFileDetail, getCurrentClientMember } from "@/lib/data/portal";
import { recordFileView } from "@/lib/actions/admin";
import { approveFileAsClient } from "@/lib/actions/portal";

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

const statusLower = { DRAFT: "draft", REVIEW: "review", APPROVED: "approved" } as const;

export default async function PortalFileDetailPage(props: PageProps<"/portal/files/[fileId]">) {
  const { fileId } = await props.params;
  const member = await getCurrentClientMember();
  if (!member) return null;

  const file = await getClientFileDetail(member.workspaceId, member.id, fileId);
  if (!file) notFound();
  await recordFileView(member.workspaceId, fileId);

  const downloadUrl = `/portal/files/${fileId}/download`;
  const previewUrl = `/portal/files/${fileId}/preview`;

  return (
    <div>
      <Link href="/portal/files" className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate hover:text-ink">
        <Icon name="arrowRight" className="h-3.5 w-3.5 rotate-180" /> All files
      </Link>

      {file.storageKey && (
        <Panel className="mb-4.5">
          <PanelHead>
            <h3 className="font-serif text-[15px] font-semibold text-ink">{file.name}</h3>
            <a
              href={downloadUrl}
              className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-[11.5px] font-semibold text-ink hover:bg-parchment"
            >
              <Icon name="upload" className="h-3.5 w-3.5 rotate-180" /> Download
            </a>
          </PanelHead>
          <FilePreview kind={getFileKind(file.name)} previewUrl={previewUrl} downloadUrl={downloadUrl} />
        </Panel>
      )}

      <Panel>
        <PanelHead>
          <h3 className="font-serif text-[14.5px] font-semibold">Details</h3>
          <Tag status={statusLower[file.status]}>{statusLower[file.status][0].toUpperCase() + statusLower[file.status].slice(1)}</Tag>
        </PanelHead>
        <div className="grid grid-cols-2 gap-4 p-[18px] text-[13px]">
          <div>
            <div className="text-[11px] text-slate-light">Size</div>
            <div className="font-medium text-ink">{formatBytes(file.sizeBytes)}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-light">Shared by</div>
            <div className="font-medium text-ink">{file.uploadedBy?.name ?? "—"}</div>
          </div>
        </div>
        {file.approvalRequested && member.canApprove && (
          <form action={approveFileAsClient} className="border-t border-parchment-2 px-[18px] py-3.5">
            <input type="hidden" name="fileId" value={file.id} />
            <button type="submit" className="rounded-lg bg-success px-3.5 py-2 text-[12.5px] font-bold text-white">
              Approve this file
            </button>
          </form>
        )}
      </Panel>
    </div>
  );
}
