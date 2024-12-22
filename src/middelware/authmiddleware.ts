import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface Authrequest extends Request{
    user:string
}

export function authmiddleware (req:Authrequest,res:Response,next:NextFunction){
    const token= String(req.header("Authorization")?.split(' ')[1])
     console.log(token)
   if (!token) {
      res.status(403).json({ message: "No token provided." });
    }
    
    const decoded = jwt.verify(token  ,process.env.JWT_SECRET || "Nasty") as JwtPayload
    
    
    console.log(typeof decoded)
    
    req.user= decoded.id
    next()
}