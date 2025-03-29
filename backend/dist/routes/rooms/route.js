"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomsRouter = void 0;
const binge_watch_common_1 = require("@kabir.26/binge-watch-common");
const client_1 = require("@prisma/client");
const express_1 = require("express");
const utils_1 = require("./utils");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get("/rooms-health", (req, res) => {
    res.status(200).json({
        message: "Rooms server is up",
    });
});
router.post("/create-room", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success, data } = binge_watch_common_1.createRoomSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({ message: "Invalid room data", error: data });
            return;
        }
        const { capacity, name } = data;
        const roomId = (0, utils_1.generateRoomId)();
        const room = yield prisma.roomDetails.create({
            data: {
                room_id: roomId,
                name,
                capacity,
            },
        });
        console.log(room);
        res.status(200).send("room created");
        return;
    }
    catch (error) { }
}));
exports.roomsRouter = router;
