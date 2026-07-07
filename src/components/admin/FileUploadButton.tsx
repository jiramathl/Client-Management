"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/lib/icons";
import { createFile } from "@/lib/actions/admin";

export function FileUploadButton({ workspaceId }: { workspaceId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("workspaceId", workspaceId);
    formData.set("file", file);
    startTransition(async () => {
      await createFile(formData);
      router.refresh();
    });
    e.target.value = "";
  }

  return (
    <>
      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} />
      <button
        type="button"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-[12.5px] font-semibold text-white disabled:opacity-60"
      >
        <Icon name="upload" className="h-3.5 w-3.5" /> {isPending ? "Uploading…" : "Upload file"}
      </button>
    </>
  );
}
