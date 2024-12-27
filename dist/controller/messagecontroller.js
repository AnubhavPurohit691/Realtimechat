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
        try {
            if (!body) {
                res.status(400).json({ message: "Message body is required." });
                return;
            }
            let existingConversation = yield db_1.default.conversation.findFirst({
                where: {
                    user: {
                        some: {
                            id: { in: [userId, to] },
                        },
                    },
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
            const newMessage = yield db_1.default.message.create({
                data: {
                    body: body,
                    conversationId: existingConversation.id,
                    senderId: userId,
                },
            });
            // Emit the new message to the other user via Socket.io
            // const io = req.app.get('io');
            // io.to(users[userId as string]).emit('newMessage', newMessage);  // To the sender
            // io.to(users[to]).emit('newMessage', newMessage);  // To the receiver
            res.status(200).json({
                message: "Message sent successfully.",
                data: newMessage,
            });
        }
        catch (error) {
            res.status(400).json({ message: "Server error!" });
        }
    });
}
function getmessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user;
        const { to } = req.params;
        try {
            const conversations = yield db_1.default.conversation.findFirst({
                where: {
                    user: {
                        some: {
                            id: { in: [userId, to] }
                        }
                    }
                },
                include: {
                    message: {
                        orderBy: {
                            createdAt: "asc"
                        }
                    }
                }
            });
            if (!conversations) {
                res.json({ message: "no conversation found!" });
                return;
            }
            res.json({ data: conversations.message });
        }
        catch (error) {
            res.status(400).json({ message: "server error!" });
        }
    });
}
function getuser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user;
        try {
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
        }
        catch (error) {
            res.status(400).json({ message: "server error!" });
        }
    });
}
