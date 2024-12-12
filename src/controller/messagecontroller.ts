import express, { Request, Response } from "express";
import { Authrequest } from "../middelware/authmiddleware";
import prisma from "../db/db";

export async function sendmessage(req: Authrequest, res: Response): Promise<void> {
    const userId = req.user; 
    const { to } = req.params
    const { body } = req.body; 

    if (!body) {
        res.status(400).json({ message: "Message body is required." });
        return;
    }

    let existingConversation = await prisma.conversation.findFirst({
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
        existingConversation = await prisma.conversation.create({
            data: {
                user: {
                    connect: [
                        { id: userId }, // Connect the authenticated user
                        { id: to }       // Connect the recipient user
                    ]
                }
            },
            include: {
                user: true, // Return the user data with the conversation
            }
        });
    }

    const newMessage = await prisma.message.create({
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
}

export async function getmessage(req:Authrequest,res:Response){

    const userId=req.user
    const {to}=req.params

    const conversations = await prisma.conversation.findFirst({
        where:{
            user:{
                some:{
                    id:{in:[userId,to]}
                }
            }
        },
        include:{
            message:{
                orderBy:{
                    createdAt:"asc"
                }
            }
        }
    })

    if(!conversations){
        res.json({message:"no conversation found!"})
        return
    }
    res.json({data:conversations.message})

}

export async function getuser(req:Authrequest,res:Response){
    const userId=req.user

    const getusers=await prisma.user.findMany({
        where:{
            id:{
                not:userId
            }
        },
        select:{
            fullName:true
        }
    })    
    res.status(200).json(getusers)
}
