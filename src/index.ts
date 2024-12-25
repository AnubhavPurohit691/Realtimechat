import express, { Request } from "express"
import http from "http"
import dotenv from "dotenv"
import userrouter from "./routes/user"
import messagerouter from "./routes/message"
import { Server } from "socket.io"
import handlesocket from "./socket/socket"
import prisma from "./db/db"

dotenv.config()
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT
app.use(express.json())

app.use("/user", userrouter)
app.use("/message", messagerouter)


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
handlesocket(io)

server.listen(port, () => {
    console.log("server connected " + port)
})


