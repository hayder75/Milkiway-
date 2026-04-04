-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "normalizedPhone" TEXT,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'seller',
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Seller_username_key" ON "Seller"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_normalizedPhone_key" ON "Seller"("normalizedPhone");

-- CreateIndex
CREATE INDEX "Seller_username_idx" ON "Seller"("username");

-- CreateIndex
CREATE INDEX "Seller_normalizedPhone_idx" ON "Seller"("normalizedPhone");

-- CreateIndex
CREATE INDEX "Seller_role_idx" ON "Seller"("role");

