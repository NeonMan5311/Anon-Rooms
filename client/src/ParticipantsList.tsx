import { ParticipantCard } from "./ParticipantCard";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ParticipantsList() {
	const participants = Array(15).fill(null);

	return (
		<div className="h-full w-full flex flex-col p-2 min-h-0 ">
			<h2 className="mb-2 text-sm font-semibold flex justify-center  text-white/95">
				Participants
			</h2>

			<ScrollArea className="flex-1 h-full pb-10  w-full ">
				<div className="flex flex-col">
					{participants.map((_, index) => (
						<ParticipantCard key={index} />
					))}
				</div>
				
			</ScrollArea>
		</div>
	);
}
