import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "./components/ui/card";

import { Profile } from "./Profile";
import { ParticipantsList } from "./ParticipantsList";
import { Chat } from "./Chat";
import { RoomInfo } from "./RoomInfo";

import { useRoomSocket } from "@/hooks/useRoomSocket";
import { getRoomId } from "./utils";
import { getClientId } from "./utils";

function App() {
	// 1️⃣ identity
	const roomId = getRoomId();
	const clientId = getClientId();
	const room = useRoomSocket(roomId || "", clientId);
	const [mobilePanel, setMobilePanel] = useState<"chat" | "people" | "room">(
		"chat"
	);

	if (!roomId) {
		return <div className="text-white p-4">Invalid room</div>;
	}

	return (
		<div className="h-[100dvh] w-full bg-[hsl(0,0%,0%)] text-white overflow-hidden">
			<div className="flex items-center gap-2 overflow-x-auto px-3 pb-1 pt-3 lg:hidden">
				<Button
					variant={mobilePanel === "chat" ? "default" : "secondary"}
					onClick={() => setMobilePanel("chat")}
					className="h-8 shrink-0 px-3 text-xs"
				>
					Chat
				</Button>
				<Button
					variant={mobilePanel === "people" ? "default" : "secondary"}
					onClick={() => setMobilePanel("people")}
					className="h-8 shrink-0 px-3 text-xs"
				>
					People
				</Button>
				<Button
					variant={mobilePanel === "room" ? "default" : "secondary"}
					onClick={() => setMobilePanel("room")}
					className="h-8 shrink-0 px-3 text-xs"
				>
					Room
				</Button>
			</div>

			<div className="grid h-[calc(100dvh-52px)] w-full min-h-0 gap-3 p-3 lg:h-[100dvh] lg:grid-cols-[280px_1fr_320px] lg:p-4">
				{/* LEFT COLUMN */}
				<div
					className={`${
						mobilePanel === "people" ? "grid" : "hidden"
					} h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3 lg:grid lg:grid-rows-2`}
				>
					{/* Profile */}
					<Card>
						<Profile
							key={room.selfUser?.id ?? "self-loading"}
							onUpdateProfile={room.updateProfile}
							initialName={room.selfUser?.name}
							initialAvatarSeed={room.selfUser?.avatar?.seed}
						/>
					</Card>

					{/* Participants */}
					<Card className="min-h-0">
						<ParticipantsList
							users={room.users}
							onToggleMic={room.toggleMic}
						/>
					</Card>
				</div>

				{/* CENTER CHAT */}
				<Card
					className={`h-full min-h-0 ${
						mobilePanel === "chat" ? "block" : "hidden"
					} lg:block`}
				>
					<Chat
						roomId={roomId}
						participantCount={room.users.length}
						messages={room.messages}
						userMap={room.userMap}
						onSend={room.sendMessage}
						onSendFile={room.sendFileMessage}
					/>
				</Card>

				{/* RIGHT COLUMN */}
				<div
					className={`grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3 ${
						mobilePanel === "room" ? "grid" : "hidden"
					} lg:grid lg:grid-rows-2`}
				>
					{/* Room info */}
					<RoomInfo
						roomId={roomId}
						expiresAt={room.expiresAt ?? 0}
						hostName={room.hostName}
					/>

					{/* Actions */}
					<Card className="p-4 flex flex-col gap-2">
						<Button
							variant="secondary"
							className="w-full"
							onClick={() => room.toggleMic(true)}
						>
							Mic
						</Button>

						<Button
							variant="secondary"
							className="w-full"
							onClick={() => {
								window.location.href = "/";
							}}
						>
							Leave Room
						</Button>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default App;
