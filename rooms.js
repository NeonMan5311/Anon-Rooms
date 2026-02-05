import { id, now } from "./utils.js";

export const rooms = new Map();

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
