import "dotenv/config";
import express from "express";
import http from "http";
import path from "node:path";
import fs from "node:fs";
import multer from "multer";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import cors from "cors";
import { createRoom, getRoom, registerRoomFile } from "./rooms.js";
import { registerSocketHandlers } from "./socket.js";
import { startCleanup } from "./cleanup.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

const allowedOrigins = [
	process.env.FRONTEND_URL_DEV,
	process.env.FRONTEND_URL_PROD,
].filter(Boolean);
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_MIME_TYPES = new Set([
	"image/jpeg",
	"image/png",
	"image/webp",
	"application/pdf",
	"text/plain",
	"application/zip",
	"application/x-zip-compressed",
]);

const ALLOWED_EXTENSIONS = new Set([
	".jpg",
	".jpeg",
	".png",
	".webp",
	".pdf",
	".txt",
	".zip",
]);

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, uploadsDir),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname || "").toLowerCase();
		const safeExt = ALLOWED_EXTENSIONS.has(ext) ? ext : "";
		const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeExt}`;
		cb(null, safeName);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		const ext = path.extname(file.originalname || "").toLowerCase();
		cb(null, true);
	},
});

const app = express();
app.use(
	cors({
		origin: allowedOrigins,
		methods: ["GET", "POST"],
		credentials: true,
	})
);
app.use("/uploads", express.static(uploadsDir));

app.get("/create-room", (req, res) => {
	const roomId = createRoom();
	res.json({ roomId });
});

app.post("/upload", (req, res) => {
	upload.single("file")(req, res, (err) => {
		if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
			res.status(400).json({ error: "File too large. Max size is 10MB." });
			return;
		}

		if (err) {
			res.status(400).json({ error: err.message || "Upload failed" });
			return;
		}

		const { roomId } = req.body;
		const room = getRoom(roomId);

		if (!room || Date.now() > room.expiresAt) {
			if (req.file?.path && fs.existsSync(req.file.path)) {
				fs.unlink(req.file.path, () => {});
			}

			res.status(400).json({ error: "Room invalid or expired" });
			return;
		}

		if (!req.file) {
			res.status(400).json({ error: "No file uploaded" });
			return;
		}

		registerRoomFile(roomId, req.file.path);

		res.json({
			fileUrl: `/uploads/${req.file.filename}`,
			fileName: req.file.originalname,
			fileSize: req.file.size,
			mimeType: req.file.mimetype,
		});
	});
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
	cors: {
		origin: allowedOrigins,
		methods: ["GET", "POST"],
		credentials: true,
	},
});

registerSocketHandlers(io);
startCleanup();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log("Server running on", PORT);
});
