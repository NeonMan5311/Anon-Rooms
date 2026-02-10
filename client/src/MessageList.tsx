import { useEffect, useRef } from "react";

type Message = {
	id: string;
	senderId: string;
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
	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="flex flex-col gap-6">
			{messages.map((msg) => {
				const senderName = msg.isMe
					? "You"
					: userMap.get(msg.senderId) ?? "Anon";

				return (
					<div
						key={msg.id}
						className={`flex flex-col ${
							msg.isMe ? "items-end" : "items-start"
						}`}
					>
						<div className="text-xs text-white/50 mb-1">
							<span className="font-medium text-white/70">
								{senderName}
							</span>
							<span className="ml-2">
								{formatTime(msg.timestamp)}
							</span>
						</div>

						<div
							className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
								msg.isMe
									? "bg-white text-black rounded-tr-sm"
									: "bg-zinc-800 text-white rounded-tl-sm"
							}`}
						>
							{msg.text}
						</div>
					</div>
				);
			})}

			<div ref={bottomRef} />
		</div>
	);
}
