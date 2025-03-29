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
const auth_1 = require("../middlewares/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
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
        const { userId } = req;
        const user = yield prisma.user.findUnique({
            where: {
                user_id: userId,
            },
        });
        if (!user) {
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
        res.status(200).json({
            message: "Room created successfully",
            roomId: room.room_id,
            username: user.username,
        });
        return;
    }
    catch (error) {
        res.status(500).send("Internal error");
        return;
    }
}));
router.post("/join-room/:roomId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("here");
        const { userId } = req;
        const user = yield prisma.user.findUnique({
            where: {
                user_id: userId,
            },
        });
        const { roomId } = req.params;
        const room = yield prisma.roomDetails.findUnique({
            where: {
                room_id: roomId,
            },
        });
        if (!room) {
            res.status(400).json({ message: "Room not found" });
            return;
        }
        if (!user) {
            res.status(400).json({ message: "Invalid user" });
            return;
        }
        res.status(200).json({ message: "Authenticated" });
        return;
    }
    catch (error) { }
}));
exports.roomsRouter = router;
