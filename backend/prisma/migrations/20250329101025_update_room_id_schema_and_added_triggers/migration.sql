/*
  Warnings:

  - Changed the type of `room_id` on the `RoomDetails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `room_id` on the `RoomParticipant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "RoomParticipant" DROP CONSTRAINT "RoomParticipant_room_id_fkey";

-- AlterTable
ALTER TABLE "RoomDetails" DROP COLUMN "room_id",
ADD COLUMN     "room_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "RoomParticipant" DROP COLUMN "room_id",
ADD COLUMN     "room_id" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RoomDetails_room_id_key" ON "RoomDetails"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "RoomParticipant_room_id_user_id_key" ON "RoomParticipant"("room_id", "user_id");

-- AddForeignKey
ALTER TABLE "RoomParticipant" ADD CONSTRAINT "RoomParticipant_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomDetails"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
