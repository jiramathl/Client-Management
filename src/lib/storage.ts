import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";

// Local-disk StorageProvider for Phase 4 — swap this implementation for an
// S3-backed one later without touching any call site (createFile/deleteFile
// actions and the download route handlers only depend on this interface).
export interface StorageProvider {
  save(key: string, data: Buffer): Promise<void>;
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
  }

  async read(key: string) {
    return readFile(this.resolve(key));
  }

  async delete(key: string) {
    await unlink(this.resolve(key)).catch(() => {});
  }
}

export const storage: StorageProvider = new LocalDiskStorageProvider();
