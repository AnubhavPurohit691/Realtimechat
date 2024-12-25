"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinschema = exports.signupschema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupschema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6).max(8),
    fullName: zod_1.default.string().min(4).max(16)
});
exports.signinschema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6).max(8)
});
