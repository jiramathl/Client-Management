-- CreateTable
CREATE TABLE "FileView" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "memberId" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileView_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FileView" ADD CONSTRAINT "FileView_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileView" ADD CONSTRAINT "FileView_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
