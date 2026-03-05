import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createRoom, getRoom } from "./rooms.js";
import { registerSocketHandlers } from "./socket.js";
import { startCleanup } from "./cleanup.js";

const app = express();
app.use(
	cors({
		origin: "https://anon-rooms.vercel.app",
		methods: ["GET", "POST"],
		credentials: true,
	})
);
app.get("/create-room", (req, res) => {
	const roomId = createRoom();
	res.json({ roomId });
});

app.get("/room/:roomId/exists", (req, res) => {
	const { roomId } = req.params;
	const room = getRoom(roomId);

	if (!room) {
		res.json({ exists: false, expired: false, full: false });
		return;
	}

	const expired = Date.now() > room.expiresAt;
	const full = room.users.size >= 10;

	if (expired) {
		res.json({ exists: false, expired: true, full: false });
		return;
	}

	res.json({ exists: true, expired: false, full });
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
