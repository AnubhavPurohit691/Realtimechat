import express from 'express'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from '../db/db'
const router = express.Router()

router.post("/signup",async(req,res)=>{
    const {fullName,email,password}=req.body
    if(!fullName|| !email || !password){
        res.json({
            message:"Give some details"
        })
    }
    const hashedpassword = await bcrypt.hash(password,10)

    const user = await prisma.user.findFirst({
        where:{
            email:email
        }
    })
    if(!user){
        res.json({
            message:"User already exist!"
        })
    }

    const newuser= await prisma.user.create({
        data:{
            email:email,
            fullName:fullName,
            password:hashedpassword
        }
    })
    const token = jwt.sign(newuser.id,process.env.JWT_SECRET||"Nasty")

    res.json({
        token
    })
})


router.post("/signin",async(req,res)=>{
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
    }


    const checkedpassword =  bcrypt.compare(password,existinguser?.password as unknown as string)

    
    if(!checkedpassword){
        res.json({
            message:"password or user is incorrect"
        })
    }

   
    const token = jwt.sign(existinguser?.id as unknown as string,process.env.JWT_SECRET||"Nasty")

    res.json({
        token
    })
})
export default router