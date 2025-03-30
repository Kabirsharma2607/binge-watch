-- AlterTable
ALTER TABLE "room_details" ADD COLUMN     "curr_capacity" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "room_details_room_id_idx" ON "room_details"("room_id");

-- CreateIndex
CREATE INDEX "room_participant_room_id_idx" ON "room_participant"("room_id");
