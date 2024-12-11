"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authmiddleware_1 = require("../middelware/authmiddleware");
const userroutes_1 = require("../controller/userroutes");
const router = express_1.default.Router();
router.post("/signup", userroutes_1.signup);
router.post("/signin", userroutes_1.signin);
router.get("/", authmiddleware_1.authmiddleware, (req, res) => {
    //@ts-ignore
    console.log(req.user);
});
exports.default = router;
