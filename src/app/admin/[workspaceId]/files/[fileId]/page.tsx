import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Panel, PanelHead } from "@/components/ui/Panel";
import { Tag } from "@/components/ui/Tag";
import { Avatar } from "@/components/ui/Avatar";
import { FilePreview } from "@/components/FilePreview";
import { Icon } from "@/lib/icons";
import { getFileKind } from "@/lib/fileKind";
import { getFileDetail, getGroups, getWorkspace } from "@/lib/data/admin";
import { recordFileView, updateFileVisibility } from "@/lib/actions/admin";

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

const statusLower = { DRAFT: "draft", REVIEW: "review", APPROVED: "approved" } as const;

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default async function FileDetailPage(props: PageProps<"/admin/[workspaceId]/files/[fileId]">) {
  const { workspaceId, fileId } = await props.params;
  const workspace = await getWorkspace(workspaceId);
  if (!workspace) return null;

  // Recording a view here, before the read, means this page's own "Viewed by" log
  // always includes the visit that just happened.
  await recordFileView(workspaceId, fileId);
  const [file, groups] = await Promise.all([getFileDetail(workspaceId, fileId), getGroups(workspaceId)]);
  if (!file) notFound();

  const downloadUrl = `/admin/${workspaceId}/files/${fileId}/download`;
  const previewUrl = `/admin/${workspaceId}/files/${fileId}/preview`;

  return (
    <>
      <AdminTopbar eyebrow={workspace.name} title={file.name} />
      <div className="flex-1 p-7">
        <Link href={`/admin/${workspaceId}/files`} className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate hover:text-ink">
          <Icon name="arrowRight" className="h-3.5 w-3.5 rotate-180" /> All files
        </Link>

        {file.storageKey && (
          <Panel className="mb-4.5">
            <PanelHead>
              <h3 className="font-serif text-[14.5px] font-semibold">Preview</h3>
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

        <div className="grid grid-cols-[1.4fr_1fr] items-start gap-4.5">
          <Panel>
            <PanelHead>
              <h3 className="font-serif text-[14.5px] font-semibold">File details</h3>
              <Tag status={statusLower[file.status]}>{statusLower[file.status][0].toUpperCase() + statusLower[file.status].slice(1)}</Tag>
            </PanelHead>
            <div className="grid grid-cols-2 gap-4 p-[18px] text-[13px]">
              <div>
                <div className="text-[11px] text-slate-light">Code</div>
                <div className="font-medium text-ink">{file.code}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-light">Size</div>
                <div className="font-medium text-ink">{formatBytes(file.sizeBytes)}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-light">Uploaded by</div>
                <div className="font-medium text-ink">{file.uploadedBy?.name ?? "—"}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-light">Uploaded</div>
                <div className="font-medium text-ink">{file.createdAt.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-light">Watermark</div>
                <div className="font-medium text-ink">{file.watermark ? "On" : "Off"}</div>
              </div>
            </div>
            <div className="border-t border-parchment-2 px-[18px] py-3.5">
              <div className="mb-1.5 text-[11px] text-slate-light">Visible to</div>
              <form action={updateFileVisibility} className="flex items-center gap-2.5">
                <input type="hidden" name="workspaceId" value={workspaceId} />
                <input type="hidden" name="fileId" value={file.id} />
                <select name="visibleGroupId" defaultValue={file.visibleGroupId ?? ""} className="rounded-lg border border-border px-2.5 py-1.5 text-[13px]">
                  <option value="">Everyone in the workspace</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} only
                    </option>
                  ))}
                </select>
                <button type="submit" className="rounded-lg bg-navy px-3 py-1.5 text-[12px] font-semibold text-white">
                  Save
                </button>
              </form>
            </div>
          </Panel>

          <Panel>
            <PanelHead>
              <h3 className="font-serif text-[14.5px] font-semibold">Viewed by</h3>
              <span className="text-[11.5px] text-slate-light">{file.views.length}</span>
            </PanelHead>
            {file.views.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-slate-light">No views yet.</div>
            ) : (
              file.views.map((v) => (
                <div key={v.id} className="flex items-center gap-2.5 border-b border-parchment-2 px-[18px] py-2.5 last:border-b-0">
                  <Avatar initials={v.member ? initialsOf(v.member.name) : "?"} className="h-6 w-6 text-[9.5px]" />
                  <span className="flex-1 text-[12.5px] text-ink">{v.member?.name ?? "Unknown"}</span>
                  <span className="text-[11px] text-slate-light">{v.viewedAt.toLocaleString()}</span>
                </div>
              ))
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
