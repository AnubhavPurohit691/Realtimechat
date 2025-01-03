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
/**
 * Send a message between users, creating a conversation if it doesn't exist.
 */
function sendmessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user;
        const { to } = req.params;
        const { body } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        if (!to || !body) {
            res.status(400).json({ message: "Recipient ID and message body are required." });
            return;
        }
        try {
            // Find or create a conversation where both userId and 'to' are participants
            let existingConversation = yield db_1.default.conversation.findFirst({
                where: {
                    AND: [
                        { user: { some: { id: userId } } },
                        { user: { some: { id: to } } },
                    ],
                },
                include: {
                    user: true,
                },
            });
            if (!existingConversation) {
                existingConversation = yield db_1.default.conversation.create({
                    data: {
                        user: {
                            connect: [
                                { id: userId },
                                { id: to },
                            ],
                        },
                    },
                    include: {
                        user: true,
                    },
                });
            }
            // Create a new message
            const newMessage = yield db_1.default.message.create({
                data: {
                    body: body,
                    conversationId: existingConversation.id,
                    senderId: userId,
                },
            });
            res.status(200).json({
                message: "Message sent successfully.",
                data: newMessage,
            });
        }
        catch (error) {
            console.error("Error in sendmessage:", error);
            res.status(500).json({ message: "Server error while sending message." });
        }
    });
}
/**
 * Get messages for a specific conversation between users.
 */
function getmessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user;
        const { to } = req.params;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        if (!to) {
            res.status(400).json({ message: "Recipient ID is required." });
            return;
        }
        try {
            const conversation = yield db_1.default.conversation.findFirst({
                where: {
                    AND: [
                        { user: { some: { id: userId } } },
                        { user: { some: { id: to } } },
                    ],
                },
                include: {
                    message: {
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },
            });
            if (!conversation) {
                res.status(404).json({ message: "No conversation found." });
                return;
            }
            res.status(200).json({ data: conversation.message });
        }
        catch (error) {
            console.error("Error in getmessage:", error);
            res.status(500).json({ message: "Server error while fetching messages." });
        }
    });
}
/**
 * Get a list of users excluding the authenticated user.
 */
function getuser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized." });
            return;
        }
        try {
            const users = yield db_1.default.user.findMany({
                where: {
                    id: {
                        not: userId,
                    },
                },
                select: {
                    fullName: true,
                    id: true,
                },
            });
            res.status(200).json(users);
        }
        catch (error) {
            console.error("Error in getuser:", error);
            res.status(500).json({ message: "Server error while fetching users." });
        }
    });
}
