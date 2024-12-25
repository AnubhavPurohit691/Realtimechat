"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
const message_1 = __importDefault(require("./routes/message"));
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./socket/socket"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const port = process.env.PORT;
app.use(express_1.default.json());
app.use("/user", user_1.default);
app.use("/message", message_1.default);
// io.on('connection', (socket) => {
//     socket.on("chat message",async(data)=>{
//         // @ts-ignore
//         let jsondata=JSON.parse(data)
//         let existingConversation = await prisma.conversation.findFirst({
//             where: {
//                 user: {
//                     some: {
//                         id: { in: [jsondata.userId, jsondata.to] },
//                     },
//                 },
//             },
//             include: {
//                 user: true,
//             },
//         });
//         if (!existingConversation) {
//             existingConversation = await prisma.conversation.create({
//                 data: {
//                     user: {
//                         connect: [
//                             { id: jsondata.userId },
//                             { id: jsondata.to },
//                         ],
//                     },
//                 },
//                 include: {
//                     user: true,
//                 },
//             });
//         }
//         const newMessage = await prisma.message.create({
//             data: {
//                 body: jsondata.body,
//                 conversationId: existingConversation.id,
//                 senderId: jsondata.userId,
//             },
//         });
//         console.log(newMessage)
//     })
//   });
(0, socket_1.default)(io);
server.listen(port, () => {
    console.log("server connected " + port);
});
