-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Sku" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "cost" DECIMAL NOT NULL,
    "supplierId" TEXT NOT NULL,
    "leadTime" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Sku_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "supplier_name_unique" ON "Supplier"("name");

-- CreateIndex
CREATE INDEX "Sku_supplierId_idx" ON "Sku"("supplierId");

-- CreateIndex
CREATE INDEX "Sku_category_idx" ON "Sku"("category");

-- CreateIndex
CREATE UNIQUE INDEX "sku_name_supplier_unique" ON "Sku"("name", "supplierId");
