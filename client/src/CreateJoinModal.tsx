import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
	onCreate: (roomId: string) => void;
	onJoin: (roomId: string) => void;
};

export function CreateJoinModal({ onCreate, onJoin }: Props) {
	const [roomId, setRoomId] = useState("");

	const createRoom = async () => {
		// backend endpoint or temporary socket emit
		const res = await fetch("http://localhost:3000/create-room");
		const data = await res.json();
		onCreate(data.roomId);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/80">
			<Card className="w-[360px] p-6 flex flex-col gap-4 text-white">
				<h1 className="text-xl font-semibold text-center">
					Anonymous Rooms
				</h1>

				<Button onClick={createRoom}>Create Room</Button>

				<div className="text-center text-white/40 text-xs">or</div>

				<input
					value={roomId}
					onChange={(e) => setRoomId(e.target.value)}
					placeholder="Enter Room ID"
					className="bg-black border border-white/10 rounded-md px-3 py-2"
				/>

				<Button
					variant="secondary"
					disabled={!roomId}
					onClick={() => onJoin(roomId)}
				>
					Join Room
				</Button>
			</Card>
		</div>
	);
}
