import { WebSocket } from "ws";
import prisma from "../db/db";
interface socketuser{
    socket: WebSocket,
    userId:string,
}

const usersocket:socketuser[]=[]
export function handlesocket(socket:WebSocket){
    socket.on("message", async(messagedata)=>{
        const {userId,to,body}=JSON.parse(messagedata.toString())

        if(!userId||!to||!body){
            socket.send(JSON.stringify({message:"invalid input"}))
        }
        
        let existingconversation = await prisma.conversation.findFirst({
            where:{
               user:{
                some:{
                    id:{
                        in:[userId,to]
                    }
                }
               } 
            },
            include:{
                user:true
            }
        })

        if(!existingconversation){
            existingconversation=await prisma.conversation.create({
                data:{
                    user:{
                        connect:[
                            {id:userId},
                            {id:to}
                        ]
                    }
                },
                include:{
                    user:true
                }
            })
        }

        const newMessage= await prisma.message.create({
            data:{
                body:body,
                senderId:userId,
                conversationId:existingconversation.id
            }
        })

        // for (const participation of existingconversation.user){
        //     const participationsocket = usersocket.find((u)=>u.userId === participation.id)?.socket
        //    if( participationsocket&&participationsocket.readyState === WebSocket.OPEN){
            socket.send(JSON.stringify({
                message:newMessage,
                conversationId:existingconversation.id
            }))
        //    }

        // }
        
    })
}