"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messagecontroller_1 = require("../controller/messagecontroller");
const authmiddleware_1 = require("../middelware/authmiddleware");
const router = express_1.default.Router();
router.post('/sendmessage/:to', authmiddleware_1.authmiddleware, messagecontroller_1.sendmessage);
router.get('/getmessage/:to', authmiddleware_1.authmiddleware, messagecontroller_1.getmessage);
router.get('/getconversation', authmiddleware_1.authmiddleware, messagecontroller_1.getuser);
exports.default = router;
