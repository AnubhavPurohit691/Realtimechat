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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = void 0;
exports.signup = signup;
const db_1 = __importDefault(require("../db/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { fullName, password, email } = req.body;
            if (!fullName || !password || !email) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }
            const existuser = yield db_1.default.user.findUnique({
                where: {
                    email
                }
            });
            if (existuser) {
                res.status(400).json({ message: "User already exists" });
                return;
            }
            const hashedpassword = yield bcrypt_1.default.hash(password, 10);
            const newuser = yield db_1.default.user.create({
                data: {
                    fullName,
                    password: hashedpassword,
                    email
                }
            });
            if (newuser) {
                const token = jsonwebtoken_1.default.sign(newuser.id, process.env.JWT_SECRET);
                res.status(201).json(token);
            }
            else {
                res.status(400).json({ message: "Invalid user data" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    });
}
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.json({
            message: "Give some details"
        });
    }
    const existinguser = yield db_1.default.user.findUnique({
        where: {
            email
        },
    });
    if (!existinguser) {
        res.json({
            message: "user doesn't exit"
        });
        return;
    }
    const checkedpassword = bcrypt_1.default.compare(password, existinguser === null || existinguser === void 0 ? void 0 : existinguser.password);
    if (!checkedpassword) {
        res.json({
            message: "password or user is incorrect"
        });
        return;
    }
    const token = jsonwebtoken_1.default.sign(existinguser === null || existinguser === void 0 ? void 0 : existinguser.id, process.env.JWT_SECRET || "Nasty");
    res.json({
        token
    });
});
exports.signin = signin;
