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

	if (!roomId) {
		return <div className="text-white p-4">Invalid room</div>;
	}

	// 2️⃣ socket + state
	const room = useRoomSocket(roomId, clientId);

	return (
		<div className="w-screen h-full bg-[hsl(0,0%,0%)]">
			<div className="grid grid-cols-[280px_1fr_320px] w-full h-screen p-4 gap-3 text-white min-h-0">
				{/* LEFT COLUMN */}
				<div className="grid h-full min-h-0 grid-rows-2 gap-3">
					{/* Profile */}
					<Card>
						<Profile onUpdateProfile={room.updateProfile} />
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
				<Card className="h-full min-h-0">
					<Chat messages={room.messages} userMap={room.userMap} onSend={room.sendMessage} />
				</Card>

				{/* RIGHT COLUMN */}
				<div className="grid h-full grid-rows-2 gap-3">
					{/* Room info */}
					<RoomInfo
						roomId={roomId}
						expiresAt={room.expiresAt}
						hostName={room.hostName}
					/>

					{/* Actions */}
					<Card className="p-4 flex flex-col gap-2">
						<Button
							variant="secondary"
							className="text-xs w-full"
							onClick={() => {
								// placeholder for file upload
								alert("File upload coming soon");
							}}
						>
							Send File
						</Button>

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
