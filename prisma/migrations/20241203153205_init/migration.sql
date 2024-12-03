-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdiotWhoHasToDoIt" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IdiotWhoHasToDoIt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Join_Todo_IdiotWhoHasToDoIt" (
    "idiotId" TEXT NOT NULL,
    "todoId" TEXT NOT NULL,

    CONSTRAINT "Join_Todo_IdiotWhoHasToDoIt_pkey" PRIMARY KEY ("idiotId","todoId")
);

-- AddForeignKey
ALTER TABLE "Join_Todo_IdiotWhoHasToDoIt" ADD CONSTRAINT "Join_Todo_IdiotWhoHasToDoIt_idiotId_fkey" FOREIGN KEY ("idiotId") REFERENCES "IdiotWhoHasToDoIt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Join_Todo_IdiotWhoHasToDoIt" ADD CONSTRAINT "Join_Todo_IdiotWhoHasToDoIt_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
