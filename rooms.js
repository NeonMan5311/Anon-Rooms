import { id, now } from "./utils.js";

export const rooms = new Map();
export const roomFiles = new Map();

export function createRoom(ttlMs = 60 * 60 * 1000) {
	const roomId = id("room_");

	rooms.set(roomId, {
		id: roomId,
		users: new Map(), // clientId -> user
		messages: [],
		expiresAt: now() + ttlMs,
	});

	return roomId;
}

export function getRoom(roomId) {
	return rooms.get(roomId);
}

export function registerRoomFile(roomId, filePath) {
	if (!roomFiles.has(roomId)) {
		roomFiles.set(roomId, new Set());
	}

	roomFiles.get(roomId).add(filePath);
}

export function getRoomFilePaths(roomId) {
	return roomFiles.get(roomId) ?? new Set();
}

export function clearRoomFileIndex(roomId) {
	roomFiles.delete(roomId);
}
