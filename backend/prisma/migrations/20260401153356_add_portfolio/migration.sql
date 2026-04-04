-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "images" TEXT[],
    "video" TEXT,
    "size" TEXT NOT NULL DEFAULT 'medium',
    "services" TEXT[],
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Portfolio_category_idx" ON "Portfolio"("category");

-- CreateIndex
CREATE INDEX "Portfolio_isActive_idx" ON "Portfolio"("isActive");

-- CreateIndex
CREATE INDEX "Portfolio_createdAt_idx" ON "Portfolio"("createdAt");
