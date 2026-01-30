import { Button } from "@/components/ui/button";
import { Card } from "./components/ui/card";
import {Profile} from "./Profile"
import { ParticipantsList } from "./ParticipantsList";
import { Chat } from "./Chat";
function App() {
	return (
		<div className="w-screen h-full bg-[hsl(0,0%,0%)]">
			<div className="grid grid-cols-[280px_1fr_320px] w-full h-screen p-4 gap-3 text-white min-h-0">
				<div className="grid h-screen min-h-0 grid-rows-2 gap-3">
					{/* Profile */}
					<Card className="">
						<Profile />
					</Card>

					{/* Participants */}
					<Card className=" min-h-0">
						<ParticipantsList />
					</Card>
				</div>

				<Card className="h-screen">
					<Chat />
				</Card>

				<div className="grid h-full grid-rows-2 gap-3">
					{/* Room info */}
					<Card className="p-4 ">
						<div>Room ID</div>
						<div>Time remaining</div>
						<div>Host</div>
					</Card>

					{/* Actions */}
					<Card className="p-4 flex flex-col gap-2">
						<Button
							variant="secondary"
							className="text-xs w-full overflow-hidden"
						>
							Send File(use sonar(shadcnsadasdsa) for
							confirmation)
						</Button>
						<Button variant="secondary" className="w-full">
							Mic
						</Button>
						<Button variant="secondary" className="w-full">
							Leave Room
						</Button>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default App;
