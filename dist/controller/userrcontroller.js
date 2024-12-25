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
exports.getme = exports.signin = void 0;
exports.signup = signup;
const db_1 = __importDefault(require("../db/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zodschema_1 = require("../zodschema");
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { fullName, password, email } = req.body;
            // Check for missing fields
            if (!fullName || !password || !email) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }
            // Validate request data
            const validateauth = zodschema_1.signupschema.safeParse({ fullName, password, email });
            if (!validateauth.success) {
                res.status(403).json({
                    message: "Validation error",
                    errors: validateauth.error.format()
                });
                return;
            }
            // Check if the user already exists
            const existuser = yield db_1.default.user.findUnique({
                where: {
                    email,
                },
            });
            if (existuser) {
                res.status(400).json({ message: "User already exists" });
                return;
            }
            // Hash password
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            // Create new user
            const newUser = yield db_1.default.user.create({
                data: {
                    fullName,
                    password: hashedPassword,
                    email,
                },
            });
            if (!newUser.id) {
                res.status(411).json({
                    message: "User not created error",
                });
                return;
            }
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.JWT_SECRET);
            // Send back user details and token
            res.status(201).json({
                message: "User created successfully",
                user: {
                    id: newUser.id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                },
                token,
            });
        }
        catch (error) {
            console.error(error); // Log the error for debugging purposes
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
    const token = jsonwebtoken_1.default.sign({ userId: existinguser.id }, process.env.JWT_SECRET || "Nasty");
    res.json({
        token
    });
});
exports.signin = signin;
const getme = (req, res) => {
    const userId = req.user;
    console.log(userId);
    res.status(200).json({ message: "Token is valid" });
};
exports.getme = getme;
