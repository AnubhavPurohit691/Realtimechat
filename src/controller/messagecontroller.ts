import express, { Request, Response } from "express";
import { Authrequest } from "../middelware/authmiddleware";
import prisma from "../db/db";
import { users } from "../socket/socket";

export async function sendmessage(req: Authrequest, res: Response): Promise<void> {
    const userId = req.user;
    const { to } = req.params;
    const { body } = req.body;

    try {
        if (!body) {
            res.status(400).json({ message: "Message body is required." });
            return;
        }

        let existingConversation = await prisma.conversation.findFirst({
            where: {
                user: {
                    some: {
                        id: { in: [userId as string , to] },
                    },
                },
            },
            include: {
                user: true,
            },
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
                include: {
                    user: true,
                },
            });
        }

        const newMessage = await prisma.message.create({
            data: {
                body: body,
                conversationId: existingConversation.id,
                senderId: userId as string,
            },
        });

        // Emit the new message to the other user via Socket.io
        const io = req.app.get('io');
        io.to(users[userId as string]).emit('newMessage', newMessage);  // To the sender
        io.to(users[to]).emit('newMessage', newMessage);  // To the receiver

        res.status(200).json({
            message: "Message sent successfully.",
            data: newMessage,
        });
    } catch (error) {
        res.status(400).json({ message: "Server error!" });
    }
}


export async function getmessage(req: Authrequest, res: Response) {
    const userId = req.user
    const { to } = req.params

    try {

        const conversations = await prisma.conversation.findFirst({
            where: {
                user: {
                    some: {
                        id: { in: [userId as string, to] }
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
        })

        if (!conversations) {
            res.json({ message: "no conversation found!" })
            return
        }
        res.json({ data: conversations.message })
    } catch (error) {
        res.status(400).json({ message: "server error!" })
    }
}

export async function getuser(req: Authrequest, res: Response) {
    const userId = req.user
    try {
        const getusers = await prisma.user.findMany({
            where: {
                id: {
                    not: userId
                }
            },
            select: {
                fullName: true
            }
        })
        res.status(200).json(getusers)
    } catch (error) {
        res.status(400).json({ message: "server error!" })
    }

}
