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
exports.handlesocket = handlesocket;
const db_1 = __importDefault(require("../db/db"));
const usersocket = [];
function handlesocket(socket) {
    socket.on("message", (messagedata) => __awaiter(this, void 0, void 0, function* () {
        const { userId, to, body } = JSON.parse(messagedata.toString());
        if (!userId || !to || !body) {
            socket.send(JSON.stringify({ message: "invalid input" }));
        }
        let existingconversation = yield db_1.default.conversation.findFirst({
            where: {
                user: {
                    some: {
                        id: {
                            in: [userId, to]
                        }
                    }
                }
            },
            include: {
                user: true
            }
        });
        if (!existingconversation) {
            existingconversation = yield db_1.default.conversation.create({
                data: {
                    user: {
                        connect: [
                            { id: userId },
                            { id: to }
                        ]
                    }
                },
                include: {
                    user: true
                }
            });
        }
        const newMessage = yield db_1.default.message.create({
            data: {
                body: body,
                senderId: userId,
                conversationId: existingconversation.id
            }
        });
        // for (const participation of existingconversation.user){
        //     const participationsocket = usersocket.find((u)=>u.userId === participation.id)?.socket
        //    if( participationsocket&&participationsocket.readyState === WebSocket.OPEN){
        socket.send(JSON.stringify({
            message: newMessage,
            conversationId: existingconversation.id
        }));
        //    }
        // }
    }));
}
