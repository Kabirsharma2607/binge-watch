"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.generateAuthToken = exports.userHashedSignupDetails = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const saltRounds = Number(process.env.SALT_ROUNDS);
const generateHash = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const hashed = yield bcrypt.hash(data, saltRounds);
    return hashed;
});
const userHashedSignupDetails = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const [hashedName, hashedEmail, hashedPassword] = yield Promise.all([
        generateHash(name),
        generateHash(email),
        generateHash(password),
    ]);
    return { hashedName, hashedEmail, hashedPassword };
});
exports.userHashedSignupDetails = userHashedSignupDetails;
const JWT_SECRET = process.env.JWT_SECRET || "default-wont-work";
const JWT_EXPIRY = "1d";
const generateAuthToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};
exports.generateAuthToken = generateAuthToken;
const validatePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.compare(password, hashedPassword);
});
exports.validatePassword = validatePassword;
