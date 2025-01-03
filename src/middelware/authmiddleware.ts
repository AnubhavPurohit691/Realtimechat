import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { json } from "stream/consumers";

export interface Authrequest extends Request{
    user?:string
}

export function authmiddleware (req:Authrequest,res:Response,next:NextFunction){
   try {
    
    const token = req.header("Authorization")?.split(' ')[1]
    if (!token) {
     res.status(403).json({ message: "No token provided." });
    return
    }
   
   const decoded = jwt.verify(token,process.env.JWT_SECRET || "Nasty") as JwtPayload
   
   
   req.user= decoded.userId
   next()
   } catch (error) {
    res.status(500).json({
      message:"server error"
    })
   }
}