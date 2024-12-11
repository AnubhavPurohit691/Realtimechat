"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authmiddleware = authmiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authmiddleware(req, res, next) {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.json({
            message: "first signup and signin"
        });
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "Nasty");
    if (!decoded || typeof decoded !== "object" || !decoded.id) {
        res.status(403).json({ message: "Invalid token." });
    }
    req.user = decoded.id;
    next();
}