import { getRoom } from "./rooms.js";
import { id, now } from "./utils.js";

export function registerSocketHandlers(io) {
	io.on("connection", (socket) => {
		let currentRoom = null;
		let currentUser = null;

		/*JOIN ROOM
		*/
		socket.on("JOIN_ROOM", (payload = {}) => {
			const { roomId, clientId } = payload;

			if (!roomId || !clientId) {
				socket.emit("JOIN_ERROR", {
					message: "roomId and clientId are required.",
				});
				return;
			}

			const room = getRoom(roomId);
			if (!room) {
				socket.emit("ROOM_NOT_FOUND");
				return;
			}

			if (Date.now() > room.expiresAt) {
				socket.emit("ROOM_EXPIRED");
				socket.disconnect();
				return;
			}

			let user = room.users.get(clientId);

			if (!user && room.users.size >= 10) {
				socket.emit("ROOM_FULL", {
					message: "This room already has 10 users.",
					maxUsers: 10,
				});
				return;
			}

			if (!user) {
				user = {
					clientId,
					roomUserId: id("anon_"),
					displayName: `Anon-${id().slice(0, 4)}`, // Generate a random display name
					avatar: { seed: id() },
					voice: { micOn: false },
					lastProfileUpdate: 0,
				};

				room.users.set(clientId, user);
			}

			currentRoom = room;
			currentUser = user;

			// ✅ JOIN ROOM FIRST
			socket.join(room.id);

			// ✅ ASSIGN HOST
			const hostExists = [...room.users.values()].some(
				(u) => u.roomUserId === room.hostId
			);

			if (!room.hostId || !hostExists) {
				room.hostId = user.roomUserId;
			}

			// ✅ BROADCAST JOIN TO OTHERS
			socket.to(room.id).emit("USER_JOINED", {
				id: user.roomUserId,
				name: user.displayName,
				avatar: user.avatar,
				micOn: user.voice.micOn,
			});

			// ✅ SEND SNAPSHOT TO SELF
			const hostUser = [...room.users.values()].find(
				(u) => u.roomUserId === room.hostId
			);

			socket.emit("ROOM_SNAPSHOT", {
				selfId: user.roomUserId,
				hostId: room.hostId,
				hostName: hostUser?.displayName ?? "Host",
				users: [...room.users.values()].map((u) => ({
					id: u.roomUserId,
					name: u.displayName,
					avatar: u.avatar,
					micOn: u.voice.micOn,
				})),
				messages: room.messages,
				expiresAt: room.expiresAt,
			});
		});


		/*SEND MESSAGE
		*/
		socket.on("SEND_MESSAGE", (payload = {}) => {
			const { text } = payload;

			if (!currentRoom || !currentUser) return;

			if (Date.now() > currentRoom.expiresAt) return;

			if (!text || !text.trim()) return;

			const message = {
				id: id("msg_"),
				senderId: currentUser.roomUserId,
				senderName: currentUser.displayName,
				text: text.trim(),
				timestamp: now(),
			};

			currentRoom.messages.push(message);

			io.to(currentRoom.id).emit("NEW_MESSAGE", message);
		});

		socket.on("SEND_FILE_MESSAGE", (payload = {}) => {
			const { fileUrl, fileName, fileSize, mimeType } = payload;

			if (!currentRoom || !currentUser) return;
			if (Date.now() > currentRoom.expiresAt) return;

			if (
				typeof fileUrl !== "string" ||
				typeof fileName !== "string" ||
				typeof fileSize !== "number" ||
				typeof mimeType !== "string"
			) {
				return;
			}

			const message = {
				id: id("msg_"),
				type: "file",
				senderId: currentUser.roomUserId,
				senderName: currentUser.displayName,
				text: "",
				timestamp: now(),
				file: {
					url: fileUrl,
					name: fileName.slice(0, 255),
					size: fileSize,
					mimeType,
				},
			};

			currentRoom.messages.push(message);

			io.to(currentRoom.id).emit("NEW_MESSAGE", message);
		});

		/*PROFILE UPDATE
		*/
		socket.on("UPDATE_PROFILE", (payload = {}) => {
			const { displayName, avatar } = payload;

			if (!currentUser || !currentRoom) return;

			const time = Date.now();

			// Rate-limit: 1 update / second
			if (time - currentUser.lastProfileUpdate < 1000) return;
			currentUser.lastProfileUpdate = time;

			if (typeof displayName === "string") {
				const trimmed = displayName.trim();
				if (trimmed) {
					currentUser.displayName = trimmed.slice(0, 10);
				}
			}

			if (avatar?.seed) {
				currentUser.avatar.seed = avatar.seed;
			}

			io.to(currentRoom.id).emit("USER_UPDATED", {
				userId: currentUser.roomUserId,
				displayName: currentUser.displayName,
				avatar: currentUser.avatar,
			});
		});

		/*MIC TOGGLE (MAX 3)*/
		socket.on("TOGGLE_MIC", (payload = {}) => {
			const { enabled } = payload;

			if (!currentRoom || !currentUser) return;
			if (typeof enabled !== "boolean") return;

			if (currentUser.voice.micOn === enabled) return;

			const activeSpeakers = [...currentRoom.users.values()].filter(
				(u) => u.voice.micOn
			);

			if (enabled && activeSpeakers.length >= 3) {
				socket.emit("MIC_REJECTED");
				return;
			}

			currentUser.voice.micOn = enabled;

			io.to(currentRoom.id).emit("VOICE_STATE_UPDATED", {
				userId: currentUser.roomUserId,
				micOn: enabled,
			});
		});

		/*DISCONNECT*/

		socket.on("disconnect", () => {
			if (!currentRoom || !currentUser) return;

			const wasHost = currentRoom.hostId === currentUser.roomUserId;

			// Turn mic off
			if (currentUser.voice.micOn) {
				io.to(currentRoom.id).emit("VOICE_STATE_UPDATED", {
					userId: currentUser.roomUserId,
					micOn: false,
				});
			}
			// Remove user
			currentRoom.users.delete(currentUser.clientId);

			if (wasHost) {
				const nextHost = currentRoom.users.values().next().value ?? null;
				currentRoom.hostId = nextHost?.roomUserId ?? null;

				if (nextHost) {
					io.to(currentRoom.id).emit("HOST_CHANGED", {
						hostId: nextHost.roomUserId,
						hostName: nextHost.displayName,
					});
				}
			}

			io.to(currentRoom.id).emit("USER_LEFT", {
				userId: currentUser.roomUserId,
			});
		});
	});
}
