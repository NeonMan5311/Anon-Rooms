import { unlink } from "node:fs/promises";
import { clearRoomFileIndex, getRoomFilePaths, rooms } from "./rooms.js";
import { now } from "./utils.js";

export function startCleanup() {
	setInterval(async () => {
		for (const [id, room] of rooms) {
			if (now() > room.expiresAt) {
				const filePaths = getRoomFilePaths(id);

				for (const filePath of filePaths) {
					try {
						await unlink(filePath);
					} catch {
						// file may already be deleted, ignore
					}
				}

				clearRoomFileIndex(id);
				rooms.delete(id);
			}
		}
	}, 30_000);
}
