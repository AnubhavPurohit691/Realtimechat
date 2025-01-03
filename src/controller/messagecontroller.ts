import express, { Request, Response } from "express";
import { Authrequest } from "../middelware/authmiddleware";
import prisma from "../db/db";

/**
 * Send a message between users, creating a conversation if it doesn't exist.
 */
export async function sendmessage(req: Authrequest, res: Response): Promise<void> {
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
        let existingConversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { user: { some: { id: userId as string } } },
                    { user: { some: { id: to } } },
                ],
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

        // Create a new message
        const newMessage = await prisma.message.create({
            data: {
                body: body,
                conversationId: existingConversation.id,
                senderId: userId as string,
            },
        });

        res.status(200).json({
            message: "Message sent successfully.",
            data: newMessage,
        });
    } catch (error) {
        console.error("Error in sendmessage:", error);
        res.status(500).json({ message: "Server error while sending message." });
    }
}

/**
 * Get messages for a specific conversation between users.
 */
export async function getmessage(req: Authrequest, res: Response): Promise<void> {
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
        const conversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { user: { some: { id: userId as string } } },
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
    } catch (error) {
        console.error("Error in getmessage:", error);
        res.status(500).json({ message: "Server error while fetching messages." });
    }
}

/**
 * Get a list of users excluding the authenticated user.
 */
export async function getuser(req: Authrequest, res: Response): Promise<void> {
    const userId = req.user;

    if (!userId) {
        res.status(401).json({ message: "Unauthorized." });
        return;
    }

    try {
        const users = await prisma.user.findMany({
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
    } catch (error) {
        console.error("Error in getuser:", error);
        res.status(500).json({ message: "Server error while fetching users." });
    }
}
