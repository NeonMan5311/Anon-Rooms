import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
	onCreate: (roomId: string) => void;
	onJoin: (roomId: string) => void;
};

export function CreateJoinModal({ onCreate, onJoin }: Props) {
	const [roomId, setRoomId] = useState("");
	const [error, setError] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [isJoining, setIsJoining] = useState(false);
	const [createRequestSent, setCreateRequestSent] = useState(false);

	const cleanRoomId = roomId.trim();
	const canJoin = cleanRoomId.length >= 4;

	const backendUrl =
		import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") ??
		"http://localhost:3000";

	const createRoom = async () => {
		if (isCreating || isJoining || createRequestSent) return;

		setError("");
		setIsCreating(true);
		setCreateRequestSent(true);

		try {
			const res = await fetch(`${backendUrl}/create-room`);
			if (!res.ok) throw new Error("Unable to create room right now.");

			const data = await res.json();
			if (!data?.roomId) throw new Error("Invalid room response from server.");

			onCreate(data.roomId);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Something went wrong while creating room."
			);
			setCreateRequestSent(false);
		} finally {
			setIsCreating(false);
		}
	};

	const joinRoom = async () => {
		if (isCreating || isJoining) return;
		if (!canJoin) {
			setError("Please enter a valid Room ID.");
			return;
		}

		setError("");
		setIsJoining(true);

		try {
			const res = await fetch(
				`${backendUrl}/room/${encodeURIComponent(cleanRoomId)}/exists`
			);

			if (!res.ok) throw new Error("Unable to verify room right now.");

			const data = await res.json();

			if (!data?.exists) {
				if (data?.expired) {
					throw new Error("This room has expired.");
				}

				throw new Error("Room not found. Check the Room ID and try again.");
			}

			if (data?.full) {
				throw new Error("This room is full.");
			}

			onJoin(cleanRoomId);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Unable to join this room right now."
			);
			setIsJoining(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
			<Card className="relative w-full max-w-[420px] border border-white/10 bg-[#171717]/95 p-6 text-white shadow-2xl backdrop-blur">
				<div className="mb-5 flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">Anonymous Rooms</h1>
					<p className="max-w-[280px] text-sm text-white/60">
						Create a private room instantly or join with a room id.
					</p>
				</div>

				<div className="space-y-5">
					<div className="rounded-xl border border-white/10 bg-black/40 p-4">
						<p className="mb-2 text-sm font-medium text-white/85">Start a new room</p>
						<Button
							onClick={createRoom}
							disabled={isCreating || isJoining || createRequestSent}
							className="h-10 w-full transition-all duration-150 active:scale-[0.98] active:brightness-110"
						>
							{isCreating || createRequestSent ? "Creating room..." : "Create Room"}
						</Button>
					</div>

					<div className="flex items-center gap-3 text-xs text-white/35">
						<div className="h-px flex-1 bg-white/10" />
						<span>OR JOIN</span>
						<div className="h-px flex-1 bg-white/10" />
					</div>

					<div className="rounded-xl border border-white/10 bg-black/40 p-4">
						<label className="mb-2 block text-xs uppercase tracking-wide text-white/55">
							Room ID
						</label>
						<input
							value={roomId}
							onChange={(e) => {
								setRoomId(e.target.value);
								if (error) setError("");
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									joinRoom();
								}
							}}
							placeholder="e.g. room_ab12cd"
							className="mb-3 h-10 w-full rounded-md border border-white/10 bg-black px-3 text-sm outline-none transition focus:border-indigo-400/70"
						/>

						<Button
							variant="secondary"
							disabled={!canJoin || isCreating || isJoining}
							onClick={joinRoom}
							className="h-10 w-full transition-all duration-150 active:scale-[0.98] active:brightness-110"
						>
							{isJoining ? "Joining..." : "Join Room"}
						</Button>
					</div>
				</div>

				{error ? (
					<div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
						{error}
					</div>
				) : (
					<div className="mt-4 text-center text-xs text-white/35">
						Press Enter to join quickly
					</div>
				)}
			</Card>
		</div>
	);
}
