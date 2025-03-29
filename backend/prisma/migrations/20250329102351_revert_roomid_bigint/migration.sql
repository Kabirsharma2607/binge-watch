/*
  Warnings:

  - Made the column `room_id` on table `RoomDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "RoomParticipant" DROP CONSTRAINT "RoomParticipant_room_id_fkey";

-- AlterTable
ALTER TABLE "RoomDetails" ALTER COLUMN "room_id" SET NOT NULL,
ALTER COLUMN "room_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "RoomParticipant" ALTER COLUMN "room_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "RoomParticipant" ADD CONSTRAINT "RoomParticipant_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "RoomDetails"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
