-- DropForeignKey
ALTER TABLE "room_participant" DROP CONSTRAINT "room_participant_room_id_fkey";

-- AlterTable
ALTER TABLE "room_details" ALTER COLUMN "room_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "room_participant" ALTER COLUMN "room_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "room_participant" ADD CONSTRAINT "room_participant_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room_details"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
