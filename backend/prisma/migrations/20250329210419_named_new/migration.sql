/*
  Warnings:

  - You are about to drop the `AuthDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoomDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoomParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthDetails" DROP CONSTRAINT "AuthDetails_user_id_fkey";

-- DropForeignKey
ALTER TABLE "RoomParticipant" DROP CONSTRAINT "RoomParticipant_room_id_fkey";

-- DropForeignKey
ALTER TABLE "RoomParticipant" DROP CONSTRAINT "RoomParticipant_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roomDetailsId_fkey";

-- DropTable
DROP TABLE "AuthDetails";

-- DropTable
DROP TABLE "RoomDetails";

-- DropTable
DROP TABLE "RoomParticipant";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "roomDetailsId" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_details" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "auth_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_participant" (
    "id" SERIAL NOT NULL,
    "room_id" BIGINT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "room_participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_details" (
    "id" SERIAL NOT NULL,
    "room_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_idx" ON "users"("id");

-- CreateIndex
CREATE INDEX "users_user_id_idx" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_details_user_id_key" ON "auth_details"("user_id");

-- CreateIndex
CREATE INDEX "auth_details_id_idx" ON "auth_details"("id");

-- CreateIndex
CREATE INDEX "auth_details_user_id_idx" ON "auth_details"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "room_participant_room_id_user_id_key" ON "room_participant"("room_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "room_details_room_id_key" ON "room_details"("room_id");

-- CreateIndex
CREATE INDEX "room_details_id_idx" ON "room_details"("id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roomDetailsId_fkey" FOREIGN KEY ("roomDetailsId") REFERENCES "room_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_details" ADD CONSTRAINT "auth_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_participant" ADD CONSTRAINT "room_participant_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room_details"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_participant" ADD CONSTRAINT "room_participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
