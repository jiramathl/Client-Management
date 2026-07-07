import { Icon } from "@/lib/icons";
import type { FileKind } from "@/lib/fileKind";

export function FilePreview({ kind, previewUrl, downloadUrl }: { kind: FileKind; previewUrl: string; downloadUrl: string }) {
  if (kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element -- previewUrl is a same-origin route, not an optimizable remote image
    return <img src={previewUrl} alt="" className="max-h-[500px] w-full bg-parchment object-contain" />;
  }
  if (kind === "pdf" || kind === "text") {
    return <iframe src={previewUrl} className="h-[500px] w-full border-0" />;
  }
  return (
    <div className="flex flex-col items-center gap-3 p-14 text-center">
      <Icon name="doc" className="h-8 w-8 text-slate-light" />
      <p className="text-[13px] text-slate-light">Preview isn&apos;t available for this file type.</p>
      <a href={downloadUrl} className="flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 text-[12.5px] font-semibold text-white">
        <Icon name="upload" className="h-3.5 w-3.5 rotate-180" /> Download to view
      </a>
    </div>
  );
}
