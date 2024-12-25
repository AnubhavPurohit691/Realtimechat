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
exports.users = void 0;
exports.default = handlesocket;
const db_1 = __importDefault(require("../db/db"));
exports.users = {}; // Keeps track of connected users by their ID
function handlesocket(io) {
    // Handle new socket connections
    io.on('connection', (socket) => {
        console.log('a user connected');
        // Save the user ID when they connect
        socket.on('register', (userId) => {
            exports.users[userId] = socket.id;
        });
        // Handle message sending
        socket.on('sendMessage', (messageData) => __awaiter(this, void 0, void 0, function* () {
            const { userId, to, body } = JSON.parse(messageData);
            // Find the conversation or create it
            let existingConversation = yield db_1.default.conversation.findFirst({
                where: {
                    user: {
                        some: {
                            id: { in: [userId, to] }
                        }
                    }
                },
                include: { user: true },
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
                    include: { user: true },
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
            // Emit the message to both users
            io.to(exports.users[userId]).emit('newMessage', newMessage); // Send to sender
            io.to(exports.users[to]).emit('newMessage', newMessage); // Send to recipient
        }));
        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('a user disconnected');
        });
    });
}
