import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";

// StorageProvider abstraction — local disk for dev, swappable for cloud
// storage in production without touching any call site. `save()` returns the
// value to persist as File.storageKey; for local disk that's just the key
// you gave it, for Vercel Blob it's the blob's URL (Blob has no deterministic
// "reconstruct the URL from the key" lookup, so the caller must store what
// comes back). `read()`/`delete()` always take back exactly that value.
export interface StorageProvider {
  save(key: string, data: Buffer): Promise<string>;
  read(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
}

const ROOT = path.join(process.cwd(), "storage");

class LocalDiskStorageProvider implements StorageProvider {
  private resolve(key: string) {
    return path.join(ROOT, key);
  }

  async save(key: string, data: Buffer) {
    const filePath = this.resolve(key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, data);
    return key;
  }

  async read(key: string) {
    return readFile(this.resolve(key));
  }

  async delete(key: string) {
    await unlink(this.resolve(key)).catch(() => {});
  }
}

// Uses public-access blobs: this app already enforces visibility/auth in the
// route handlers before ever handing out a file's contents, so the extra
// layer of "the blob URL itself is unguessable but technically public" is an
// acceptable tradeoff for not needing the private-blob token-auth flow.
class VercelBlobStorageProvider implements StorageProvider {
  async save(key: string, data: Buffer) {
    const { put } = await import("@vercel/blob");
    const blob = await put(key, data, { access: "public", addRandomSuffix: false });
    return blob.url;
  }

  async read(key: string) {
    const res = await fetch(key);
    if (!res.ok) throw new Error(`Failed to read blob ${key}: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }

  async delete(key: string) {
    const { del } = await import("@vercel/blob");
    await del(key);
  }
}

export const storage: StorageProvider =
  process.env.STORAGE_DRIVER === "vercel-blob" ? new VercelBlobStorageProvider() : new LocalDiskStorageProvider();
