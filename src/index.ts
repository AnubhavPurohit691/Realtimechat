import express from "express"
import dotenv from "dotenv"
dotenv.config()
const app=express()
const port = process.env.PORT
app.get("/",(req,res)=>{
    res.json({message:"hello bhai"})
})
app.listen(port,()=>{
    console.log("server connected "+port)
})