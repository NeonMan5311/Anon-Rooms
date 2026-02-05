import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createRoom } from "./rooms.js";
import { registerSocketHandlers } from "./socket.js";
import { startCleanup } from "./cleanup.js";

const app = express();
app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	})
);
app.get("/create-room", (req, res) => {
	const roomId = createRoom();
	res.json({ roomId });
});

const server = http.createServer(app);

const io = new Server(server, {
	cors: { origin: "*" },
});

registerSocketHandlers(io);
startCleanup();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log("Server running on", PORT);
});
