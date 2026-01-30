import React from "react";
import { Button } from "./components/ui/button";
import { MessageList } from "./MessageList";

export function Chat() {
    const [message, setMessage] = React.useState("");
    
	return (
		<div className="flex flex-col h-full w-full">
			{/* Messages */}
				<MessageList />
			
			{/* Typing indicator */}
			<div className="px-6 py-1 text-sm text-white/50">
				abc is typing…
			</div>

			{/* Input */}
			<div className="p-4 borader-t border-white/10">
				<div className="flex gap-2">
					<input
						className="flex-1 rounded-xl bg-black  px-4 py-2"
						placeholder="Type a message…"
					/>
					<Button>Send</Button>
				</div>
			</div>
		</div>
	);
}
