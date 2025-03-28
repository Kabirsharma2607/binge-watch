-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roomDetailsId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthDetails" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "AuthDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomParticipant" (
    "id" SERIAL NOT NULL,
    "room_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "RoomParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomDetails" (
    "id" SERIAL NOT NULL,
    "room_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AuthDetails_user_id_key" ON "AuthDetails"("user_id");

-- CreateIndex
CREATE INDEX "AuthDetails_id_idx" ON "AuthDetails"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RoomParticipant_room_id_user_id_key" ON "RoomParticipant"("room_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "RoomDetails_room_id_key" ON "RoomDetails"("room_id");

-- CreateIndex
CREATE INDEX "RoomDetails_id_idx" ON "RoomDetails"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomDetailsId_fkey" FOREIGN KEY ("roomDetailsId") REFERENCES "RoomDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthDetails" ADD CONSTRAINT "AuthDetails_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomParticipant" ADD CONSTRAINT "RoomParticipant_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomDetails"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomParticipant" ADD CONSTRAINT "RoomParticipant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
