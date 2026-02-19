type Message = {
	id: string;
	senderId: string;
	senderName?: string;
	text: string;
	timestamp: number;
	isMe?: boolean;
};

type MessageListProps = {
	messages: Message[];
	userMap: Map<string, string>;
};

// small helper (you can move this elsewhere later)
function formatTime(ts: number) {
	return new Date(ts).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function MessageList({ messages, userMap }: MessageListProps) {
	return (
		<div className="flex flex-col gap-1 pb-4">
			{messages.map((msg, index) => {
				const previous = messages[index - 1];
				const isFirstInGroup =
					index === 0 || previous.senderId !== msg.senderId;

				const senderName = msg.isMe
					? "You"
					: msg.senderName ?? userMap.get(msg.senderId) ?? "Anon";

				return (
					<div
						key={msg.id}
						className={`flex flex-col ${
							msg.isMe ? "items-end" : "items-start"
						} ${isFirstInGroup ? "mt-4 first:mt-0" : "mt-1"}`}
					>
						{isFirstInGroup && (
							<div className="mb-1 text-xs text-white/50">
								<span className="font-medium text-white/70">
									{senderName}
								</span>
								<span className="ml-2">
									{formatTime(msg.timestamp)}
								</span>
							</div>
						)}

						<div
							className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
								msg.isMe
									? "bg-white text-black rounded-tr-sm"
									: "bg-zinc-800 text-white rounded-tl-sm"
							} whitespace-pre-wrap break-words`}
						>
							{msg.text}
						</div>
					</div>
				);
			})}
		</div>
	);
}
