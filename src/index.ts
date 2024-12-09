import express from "express"
import dotenv from "dotenv"
import userrouter from "./routes/user"
dotenv.config()
const app=express()
const port = process.env.PORT
app.use(express.json())

app.use("/user",userrouter)

app.listen(port,()=>{
    console.log("server connected "+port)
})