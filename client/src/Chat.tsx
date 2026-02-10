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
	userMap: Map<string, string>;
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
		<div className="flex h-full w-full min-h-0 flex-col overflow-hidden">
			{/* Messages */}
			<div className="flex-1 min-h-0 overflow-y-auto px-6 pt-6">
				<MessageList messages={messages} userMap={userMap} />
			</div>

			{/* Typing indicator (placeholder for later) */}
			<div className="px-6 py-1 text-sm text-white/50">
				{/* typing indicator later */}
			</div>

			{/* Input */}
			<div className="shrink-0 border-t border-white/10 p-4">
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
