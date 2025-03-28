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
exports.authRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get("/auth-health", (req, res) => {
    res.status(200).json({
        message: "Auth is up",
    });
});
router.post("/sign-up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("here");
    const { body } = req;
    const { name, email, password, username } = body;
    const user = yield prisma.user.findUnique({
        where: {
            username,
        },
    });
    if (user) {
        console.log("user is there");
        res.status(400);
        return;
    }
    const newUser = yield prisma.user.create({
        data: {
            name,
            username,
            email,
            authDetails: {
                create: {
                    password,
                },
            },
        },
    });
    res.status(200);
    return;
}));
exports.authRouter = router;
