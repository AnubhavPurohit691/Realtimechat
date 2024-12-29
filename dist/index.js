"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
const message_1 = __importDefault(require("./routes/message"));
const ws_1 = require("ws");
const socket_1 = require("./socket/socket");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/user", user_1.default);
app.use("/message", message_1.default);
const wss = new ws_1.WebSocketServer({ server });
wss.on("connection", (socket) => {
    (0, socket_1.handlesocket)(socket);
});
wss.on("close", console.error);
server.listen(port, () => {
    console.log("server connected " + port);
});
