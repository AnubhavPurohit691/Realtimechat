import express, { Request } from "express"
import http, { createServer } from "http"
import dotenv from "dotenv"
import userrouter from "./routes/user"
import messagerouter from "./routes/message"
import { WebSocketServer } from "ws"
import {handlesocket }from "./socket/socket"
import cors from "cors"
dotenv.config()
const app = express();
const server = createServer(app)

const port = process.env.PORT
app.use(cors())
app.use(express.json())
app.use("/user", userrouter)
app.use("/message", messagerouter)

const wss = new WebSocketServer({server})



wss.on("connection",(socket)=>{
    handlesocket(socket)
})

wss.on("close",console.error)

server.listen(port, () => {
    console.log("server connected " + port)
})


