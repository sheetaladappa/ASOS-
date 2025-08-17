-- CreateTable
CREATE TABLE "Inbound" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poId" TEXT NOT NULL,
    "courier" TEXT NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "eta" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'in_transit',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inbound_poId_fkey" FOREIGN KEY ("poId") REFERENCES "Po" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Inbound_poId_idx" ON "Inbound"("poId");

-- CreateIndex
CREATE INDEX "Inbound_status_idx" ON "Inbound"("status");
