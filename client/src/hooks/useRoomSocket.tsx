import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useRoomSocket(roomId: string, clientId: string) {
	const socketRef = useRef<Socket | null>(null);

	const [users, setUsers] = useState<any[]>([]);
	const [messages, setMessages] = useState<any[]>([]);
	const [expiresAt, setExpiresAt] = useState<number | null>(null);
    const [selfId, setSelfId] = useState<string | null>(null);
	const selfIdRef = useRef<string | null>(null);

	

	useEffect(() => {
		const socket = io(
			import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000"
		);

		socketRef.current = socket;

		socket.emit("JOIN_ROOM", { roomId, clientId });

		socket.on("ROOM_SNAPSHOT", (data) => {
			selfIdRef.current = data.selfId;
			setSelfId(data.selfId);
			setUsers(data.users);
			setMessages(
				data.messages.map((m) => ({
					...m,
					isMe: false,
				}))
			);
		});


		socket.on("NEW_MESSAGE", (message) => {
			const myId = selfIdRef.current;

			setMessages((prev) => [
				...prev,
				{
					...message,
					isMe: false,
				},
			]);
		});

		socket.on("USER_JOINED", (user) => {
			setUsers((prev) => {
				// avoid duplicates
				if (prev.some((u) => u.id === user.id)) return prev;
				return [...prev, user];
			});
		});
		socket.on("USER_LEFT", ({ userId }) => {
			setUsers((prev) => prev.filter((u) => u.id !== userId));
		});



		socket.on("USER_UPDATED", (payload) => {
			setUsers((prev) =>
				prev.map((u) =>
					u.id === payload.userId
						? {
								...u,
								name: payload.displayName,
								avatar: payload.avatar,
						  }
						: u
				)
			);
		});

		socket.on("VOICE_STATE_UPDATED", (payload) => {
			setUsers((prev) =>
				prev.map((u) =>
					u.id === payload.userId ? { ...u, micOn: payload.micOn } : u
				)
			);
		});

		socket.on("MIC_REJECTED", () => {
			alert("Only 3 people can speak at a time");
		});

		return () => {
			socket.disconnect();
		};
	}, [roomId, clientId]);

	/* -------- PUBLIC FUNCTIONS -------- */

	const sendMessage = (text: string) => {
		socketRef.current?.emit("SEND_MESSAGE", { text });
	};

	const updateProfile = (data: {
		displayName?: string;
		avatar?: { seed: string };
	}) => {
		socketRef.current?.emit("UPDATE_PROFILE", data);
	};

	const toggleMic = (enabled: boolean) => {
		socketRef.current?.emit("TOGGLE_MIC", { enabled });
	};
	const userMap = useMemo(() => {
		const map = new Map<string, string>();
		users.forEach((u) => {
			map.set(u.id, u.name);
		});
		return map;
	}, [users]);	return {
		users,
		messages,
		expiresAt,
		userMap,
		sendMessage,
		updateProfile,
		toggleMic,
	};
}
