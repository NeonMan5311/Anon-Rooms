import { ParticipantCard } from "./ParticipantCard";
import { ScrollArea } from "@/components/ui/scroll-area";

type ParticipantsListProps = {
	users: {
		id: string;
		name: string;
		avatar: { seed: string };
		micOn: boolean;
	}[];
	onToggleMic: (enabled: boolean) => void;
};

export function ParticipantsList({
	users,
	onToggleMic,
}: ParticipantsListProps) {
	return (
		<div className="h-full w-full flex flex-col p-2 min-h-0">
			<h2 className="mb-2 text-sm font-semibold flex justify-center text-white/95">
				Participants
			</h2>

			<ScrollArea className="flex-1 h-full pb-10 w-full">
				<div className="flex flex-col">
					{users.map((user) => (
						<ParticipantCard
							key={user.id}
							user={user}
							onToggleMic={onToggleMic}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	);
}
