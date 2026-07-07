import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { FileUploadButton } from "@/components/admin/FileUploadButton";
import { Panel } from "@/components/ui/Panel";
import { Tag } from "@/components/ui/Tag";
import { Icon } from "@/lib/icons";
import { getFiles, getWorkspace } from "@/lib/data/admin";
import { deleteFile } from "@/lib/actions/admin";

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

const statusLower = { DRAFT: "draft", REVIEW: "review", APPROVED: "approved" } as const;

export default async function FilesPage(props: PageProps<"/admin/[workspaceId]/files">) {
  const { workspaceId } = await props.params;
  const [workspace, files] = await Promise.all([getWorkspace(workspaceId), getFiles(workspaceId)]);
  if (!workspace) return null;

  return (
    <>
      <AdminTopbar eyebrow={workspace.name} title="Files" />
      <div className="flex-1 p-7">
        <Panel>
          <div className="flex items-center justify-between border-b border-border px-[18px] py-3.5">
            <h3 className="font-serif text-[14.5px] font-semibold">Manifest of shared documents</h3>
            <div className="flex items-center gap-3">
              <span className="text-[11.5px] text-slate-light">{files.length} files</span>
              <FileUploadButton workspaceId={workspaceId} />
            </div>
          </div>
          {files.length === 0 ? (
            <div className="p-10 text-center text-[13px] text-slate-light">No files yet.</div>
          ) : (
            files.map((f) => (
              <div
                key={f.id}
                className="grid grid-cols-[34px_1fr_110px_90px_130px_60px_28px] items-center gap-2.5 border-b border-parchment-2 px-[18px] py-3 text-[13px] last:border-b-0"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-parchment text-teal">
                  <Icon name="doc" className="h-4 w-4" />
                </span>
                <div>
                  <div className="font-medium text-ink">{f.name}</div>
                  <div className="text-[11px] text-slate-light">{f.code}</div>
                </div>
                <span className="text-slate">{formatBytes(f.sizeBytes)}</span>
                <span className="text-slate">{f.uploadedBy?.name ?? "—"}</span>
                <Tag status={statusLower[f.status]}>{statusLower[f.status][0].toUpperCase() + statusLower[f.status].slice(1)}</Tag>
                <Link href={`/admin/${workspaceId}/files/${f.id}`} className="text-[11.5px] font-semibold text-teal hover:underline">
                  View
                </Link>
                <form action={deleteFile}>
                  <input type="hidden" name="workspaceId" value={workspaceId} />
                  <input type="hidden" name="fileId" value={f.id} />
                  <button type="submit" className="text-slate-light hover:text-danger" title="Delete file">
                    <Icon name="x" className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ))
          )}
        </Panel>
      </div>
    </>
  );
}
