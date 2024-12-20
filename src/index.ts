import express, { Request } from "express"
import http from "http"
import dotenv from "dotenv"
import userrouter from "./routes/user"
import messagerouter from "./routes/message"
import { Server } from "socket.io"
import handlesocket from "./socket/socket"

dotenv.config()
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT
app.use(express.json())

app.use("/user", userrouter)
app.use("/message", messagerouter)

handlesocket(io)


server.listen(port, () => {
    console.log("server connected " + port)
})


