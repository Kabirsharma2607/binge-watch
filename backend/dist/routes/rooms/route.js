"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomsRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
router.use("/rooms-health", (req, res) => {
    res.status(200).json({
        message: "Rooms server is up",
    });
});
exports.roomsRouter = router;
