
import { Request, Response } from "express"
import prisma from "../db/db"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function signup(req:Request,res:Response):Promise<void>{
    try {
        const {fullName,password,email}=req.body
        if(!fullName ||  !password || !email){
            res.status(400).json({message:"All fields are required"})
            return;
        }
        const existuser=await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(existuser){
             res.status(400).json({message:"User already exists"})
             return
        }

        const hashedpassword=await bcrypt.hash(password,10)
       const newuser= await prisma.user.create({
            data:{
                fullName,
                password:hashedpassword,
                email
            }
        })
        if(newuser){
            const token=jwt.sign(newuser.id,process.env.JWT_SECRET!)
        res.status(201).json(token)
        }
    else{
        res.status(400).json({message:"Invalid user data"})
    }
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
    }
}

export const signin = async(req:Request,res:Response):Promise<void>=>{
    const {email,password}=req.body
    if( !email || !password){
        res.json({
            message:"Give some details"
        })
    }

    const existinguser= await prisma.user.findUnique({
        where:{
            email
        },
        
    })
    if(!existinguser){
        res.json({
            message:"user doesn't exit"
        })
        return ;
    }


    const checkedpassword =  bcrypt.compare(password,existinguser?.password as unknown as string)

    
    if(!checkedpassword){
        res.json({
            message:"password or user is incorrect"
        })
        return;
    }
    const token = jwt.sign(existinguser.id ,process.env.JWT_SECRET||"Nasty")

    res.json({
        token
    })
}