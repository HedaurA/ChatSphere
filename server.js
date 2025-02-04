const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = new Set();

wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("Новий клієнт підключений!");

    ws.on("message", (message) => {
        console.log(`Отримано: ${message}`);
        for (let client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    });

    ws.on("close", () => {
        clients.delete(ws);
        console.log("Клієнт відключився");
    });
});

app.get("/", (req, res) => {
    res.send("WebSocket сервер працює!");
});

server.listen(3000, () => {
    console.log("Сервер запущено на порту 3000");
});
