import express from "express"
const app=express()
const port = 8000
app.get("/",(req,res)=>{
    res.json({message:"hello bhai"})
})
app.listen(port,()=>{
    console.log("server connected "+port)
})