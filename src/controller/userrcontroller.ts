
import { Request, Response } from "express"
import prisma from "../db/db"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Authrequest } from "../middelware/authmiddleware"
import { signupschema } from "../zodschema"

export async function signup(req: Request, res: Response): Promise<void> {
    try {
        const { fullName, password, email } = req.body;

        // Check for missing fields
        if (!fullName || !password || !email) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        // Validate request data
        const validateauth = signupschema.safeParse({ fullName, password, email });
        if (!validateauth.success) {
            res.status(403).json({
                message: "Validation error",
                errors: validateauth.error.format()
            });
            return;
        }

        // Check if the user already exists
        const existuser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existuser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                fullName,
                password: hashedPassword,
                email,
            },
        });

        if (!newUser.id) {
            res.status(411).json({
                message: "User not created error",
            });
            return;
        }

        // Generate JWT token
        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET as string);

        // Send back user details and token
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
            },
            token,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ message: "Something went wrong" });
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
    const token = jwt.sign({userId:existinguser.id} ,process.env.JWT_SECRET||"Nasty")

    res.json({
        token
    })
}
export const getme =(req: Authrequest, res: Response): void => {
    const userId=req.user
    console.log(userId)
    res.status(200).json({ message: "Token is valid" });
  }