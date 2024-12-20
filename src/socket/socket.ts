import { Server } from "socket.io";
import prisma from "../db/db";

export const users :any= {};  // Keeps track of connected users by their ID
export default function handlesocket(io:Server){


// Handle new socket connections
io.on('connection', (socket) => {
    console.log('a user connected');

    // Save the user ID when they connect
    socket.on('register', (userId: string) => {
        users[userId] = socket.id;
    });

    // Handle message sending
    socket.on('sendMessage', async (messageData) => {
        const { userId, to, body } = messageData;

        // Find the conversation or create it
        let existingConversation = await prisma.conversation.findFirst({
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
            existingConversation = await prisma.conversation.create({
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
        const newMessage = await prisma.message.create({
            data: {
                body: body,
                conversationId: existingConversation.id,
                senderId: userId,
            },
        });

        // Emit the message to both users
        io.to(users[userId]).emit('newMessage', newMessage);  // Send to sender
        io.to(users[to]).emit('newMessage', newMessage);  // Send to recipient
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

}