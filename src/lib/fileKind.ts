export type FileKind = "image" | "pdf" | "text" | "unsupported";

const IMAGE_EXT = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
const TEXT_EXT = ["txt", "md", "csv", "json", "log"];

const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  txt: "text/plain",
  md: "text/markdown",
  csv: "text/csv",
  json: "application/json",
  log: "text/plain",
};

function extOf(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export function getFileKind(name: string): FileKind {
  const ext = extOf(name);
  if (IMAGE_EXT.includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (TEXT_EXT.includes(ext)) return "text";
  return "unsupported";
}

export function getMimeType(name: string): string {
  return MIME_BY_EXT[extOf(name)] ?? "application/octet-stream";
}
