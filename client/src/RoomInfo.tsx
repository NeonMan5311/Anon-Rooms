import { Hash, Copy, Clock, User } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { QrCode } from "./QrCode";
type RoomInfoProps = {
	roomId: string;
	expiresAt: number; // unix timestamp (ms)
	hostName: string;
};

export function RoomInfo({ roomId, expiresAt, hostName }: RoomInfoProps) {
	const [remaining, setRemaining] = useState<number>(0);

	useEffect(() => {
		const update = () => {
			const diff = expiresAt - Date.now();
			setRemaining(Math.max(diff, 0));
		};

		update();
		const interval = setInterval(update, 1000);
		return () => clearInterval(interval);
	}, [expiresAt]);

	const minutes = Math.floor(remaining / 60000);
	const seconds = Math.floor((remaining % 60000) / 1000)
		.toString()
		.padStart(2, "0");

	const copyRoomId = () => {
		navigator.clipboard.writeText(roomId);
		toast.success("Room ID copied to clipboard");
	};

	return (
		<Card className="p-5 flex flex-col gap-6 border-white/10">
			{/* Header */}
			<div className="flex items-center gap-2 text-white/50 text-sm uppercase tracking-wider font-semibold">
				<Hash className="w-4 h-4" />
				<span>Room Details</span>
			</div>

			{/* Room ID */}
			<div className="space-y-1.5">
				<label className="text-xs text-white/40 font-medium ml-1">
					Room ID
				</label>
				<div className="flex items-center gap-2 p-1.5 pl-3 pr-1.5 rounded-lg bg-black/40 border border-white/5">
					<code className="flex-1 font-mono text-sm text-white/80 tracking-wide">
						{roomId}
					</code>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10"
						onClick={copyRoomId}
					>
						<Copy className="w-3.5 h-3.5" />
					</Button>
					<QrCode /> 
				</div>
			</div>

			{/* Time Remaining */}
			<div className="space-y-1.5">
				<label className="text-xs text-white/40 font-medium ml-1">
					Time Remaining
				</label>
				<div className="flex items-center gap-3 p-3 rounded-xl border border-white/5">
					<div className="p-2 rounded-full bg-white/10 text-white">
						<Clock className="w-5 h-5" />
					</div>
					<div className="text-2xl font-bold font-mono tracking-tight">
						{minutes}:{seconds}
					</div>
				</div>
			</div>

			{/* Host */}
			<div className="space-y-1.5">
				<label className="text-xs text-white/40 font-medium ml-1">
					Host
				</label>
				<div className="flex items-center gap-3 p-2 rounded-lg">
					<div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-300">
						<User className="w-5 h-5" />
					</div>
					<span className="text-sm font-medium text-white/90">
						{hostName}
					</span>
				</div>
			</div>
		</Card>
	);
}
