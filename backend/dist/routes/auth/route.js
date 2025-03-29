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
const utils_1 = require("./utils");
const binge_watch_common_1 = require("@kabir.26/binge-watch-common");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get("/auth-health", (req, res) => {
    res.status(200).json({
        message: "Auth is up",
    });
});
router.post("/sign-up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const { success } = binge_watch_common_1.signUpSchema.safeParse(body);
        if (!success) {
            res.status(400).send("Invalid signup details");
            return;
        }
        const { name, email, password, username } = body;
        const user = yield prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (user) {
            res.status(400).send("User already exists");
            return;
        }
        const { hashedName, hashedEmail, hashedPassword } = yield (0, utils_1.userHashedSignupDetails)(name, email, password);
        const newUser = yield prisma.user.create({
            data: {
                name: hashedName,
                username,
                email: hashedEmail,
                authDetails: {
                    create: {
                        password: hashedPassword,
                    },
                },
            },
        });
        if (newUser) {
            const authToken = (0, utils_1.generateAuthToken)(newUser.user_id);
            res.status(201).json({
                message: "User created",
                token: authToken,
            });
        }
        else {
            res.status(400).send("User not created");
        }
        return;
    }
    catch (error) {
        res.status(500).send("Internal error");
        return;
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { body } = req;
        console.log(body);
        const data = binge_watch_common_1.loginSchema.parse(body);
        // const data = loginSchema.safeParse(body);
        const { username, password } = body;
        console.log(data);
        // if (!success) {
        //   res.status(400).send("Invalid login details");
        //   return;
        // }
        const user = yield prisma.user.findUnique({
            where: {
                username,
            },
            select: {
                user_id: true,
                authDetails: {
                    select: {
                        password: true,
                    },
                },
            },
        });
        if (!user) {
            res.status(401).send("Invalid credentials");
            return;
        }
        const isPasswordValid = yield (0, utils_1.validatePassword)(password, (_a = user.authDetails) === null || _a === void 0 ? void 0 : _a.password);
        if (isPasswordValid) {
            const authToken = (0, utils_1.generateAuthToken)(user.user_id);
            res.status(200).json({
                message: "Logged in",
                token: authToken,
            });
        }
        else {
            res.status(401).send("Invalid credentials");
        }
        return;
    }
    catch (error) {
        res.status(500).send("Internal error");
        return;
    }
}));
exports.authRouter = router;
