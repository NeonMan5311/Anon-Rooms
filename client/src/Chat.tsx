import React from "react";
import { Button } from "./components/ui/button";
import { MessageList } from "./MessageList";

type ChatProps = {
	messages: {
		id: string;
		senderId: string;
		text: string;
		timestamp: number;
		isMe?: boolean;
	}[];
	onSend: (text: string) => void;
};

export function Chat({ messages, onSend, userMap }: ChatProps) {
	const [message, setMessage] = React.useState("");

	const handleSend = () => {
		if (!message.trim()) return;
		onSend(message.trim());
		setMessage("");
	};

	return (
		<div className="flex flex-col h-full w-full min-h-0">
			{/* Messages */}
			<MessageList messages={messages} userMap={userMap} />

			{/* Typing indicator (placeholder for later) */}
			<div className="px-6 py-1 text-sm text-white/50">
				{/* typing indicator later */}
			</div>

			{/* Input */}
			<div className="p-4 border-t border-white/10">
				<div className="flex gap-2">
					<input
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSend();
						}}
						className="flex-1 rounded-xl bg-black px-4 py-2 outline-none"
						placeholder="Type a message…"
					/>
					<Button onClick={handleSend}>Send</Button>
				</div>
			</div>
		</div>
	);
}
