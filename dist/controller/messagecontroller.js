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
exports.sendmessage = sendmessage;
exports.getmessage = getmessage;
exports.getuser = getuser;
const db_1 = __importDefault(require("../db/db"));
function sendmessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user;
        const { to } = req.params;
        const { body } = req.body;
        if (!body) {
            res.status(400).json({ message: "Message body is required." });
            return;
        }
        let existingConversation = yield db_1.default.conversation.findFirst({
            where: {
                user: {
                    some: {
                        id: { in: [userId, to] } // Check if both sender (userId) and receiver (to) are part of the conversation
                    }
                }
            },
            include: {
                user: true, // Include the users in the conversation 
            }
        });
        if (!existingConversation) {
            existingConversation = yield db_1.default.conversation.create({
                data: {
                    user: {
                        connect: [
                            { id: userId }, // Connect the authenticated user
                            { id: to } // Connect the recipient user
                        ]
                    }
                },
                include: {
                    user: true, // Return the user data with the conversation
                }
            });
        }
        const newMessage = yield db_1.default.message.create({
            data: {
                body: body,
                conversationId: existingConversation.id, // Associate the message with the conversation
                senderId: userId // The message sender
            }
        });
        res.status(200).json({
            message: "Message sent successfully.",
            data: newMessage
        });
    });
}
function getmessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user;
        const { to } = req.params;
        const conversations = yield db_1.default.conversation.findFirst({
            where: {
                user: {
                    some: {
                        id: { in: [userId, to] }
                    }
                }
            },
            include: {
                message: true
            }
        });
        if (!conversations) {
            res.json({ message: "no conversation found!" });
            return;
        }
        res.json({ data: conversations.message });
    });
}
function getuser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user;
        const getusers = yield db_1.default.user.findMany({
            where: {
                id: {
                    not: userId
                }
            },
            select: {
                fullName: true
            }
        });
        res.status(200).json(getusers);
    });
}
