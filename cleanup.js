import { rooms } from "./rooms.js";
import { now } from "./utils.js";

export function startCleanup() {
	setInterval(() => {
		for (const [id, room] of rooms) {
			if (now() > room.expiresAt) {
				rooms.delete(id);
			}
		}
	}, 30_000);
}
