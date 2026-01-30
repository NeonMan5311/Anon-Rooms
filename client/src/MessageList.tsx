import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data to demonstrate the layout
const MOCK_MESSAGES = [
	{
		id: 1,
		sender: "Alice",
		text: "Hey everyone! ready for the sync?",
		time: "10:00 AM",
		isMe: false,
	},
	{
		id: 2,
		sender: "Bob",
		text: "Just grabbing some coffee ☕️",
		time: "10:01 AM",
		isMe: false,
	},
	{
		id: 3,
		sender: "Me",
		text: "No worries, we can start in 5.",
		time: "10:02 AM",
		isMe: true,
	},
	{
		id: 4,
		sender: "Alice",
		text: "Perfect. I uploaded the design files.",
		time: "10:03 AM",
		isMe: false,
	},
	{
		id: 5,
		sender: "Me",
		text: "Got them. Looks great!",
		time: "10:04 AM",
		isMe: true,
	},
	{
		id: 6,
		sender: "Me",
		text: "Let's discuss the mobile view first.",
		time: "10:04 AM",
		isMe: true,
	},
	{
		id: 6,
		sender: "Me",
		text: "Let's discuss the mobile view first.",
		time: "10:04 AM",
		isMe: true,
	},
	{
		id: 6,
		sender: "Me",
		text: "Let's discuss the mobile view first.",
		time: "10:04 AM",
		isMe: true,
	},
	{
		id: 6,
		sender: "Me",
		text: "Let's discuss the mobile view first.",
		time: "10:04 AM",
		isMe: true,
	},
	{
		id: 6,
		sender: "Me",
		text: "Let's discuss the mobile view first.",
		time: "10:04 AM",
		isMe: true,
	},
	{
		id: 6,
		sender: "Me",
		text: "Let's discuss the mobile view first.",
		time: "10:04 AM",
		isMe: true,
	},
	{
		id: 6,
		sender: "Me",
		text: "Let's discuss the mobile view first.",
		time: "10:04 AM",
		isMe: true,
	},
];
export function MessageList() {

	return (
		<div className="flex-1 w-full overflow-y-auto min-h-0 p-4">
			<div className="flex flex-col gap-6">
				{MOCK_MESSAGES.map((msg, index) => (
					<div
						key={`${msg.id}-${index}`}
						className={`flex flex-col ${
							msg.isMe ? "items-end" : "items-start"
						}`}
					>
						{/* Header: Name & Time */}
						<div className="flex items-center gap-2 mb-1 text-xs text-white/50 px-1">
							<span className="font-medium text-white/70">
								{msg.sender}
							</span>
							<span>{msg.time}</span>
						</div>

						{/* Chat Bubble */}
						<div
							className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
								msg.isMe
									? "bg-[hsl(0,0%,90%)] text-[hsl(0,0%,10%)] rounded-tr-sm"
									: "bg-[hsl(0,0%,15%)] text-[hsl(0,0%,90%)] rounded-tl-sm"
							}`}
						>
							{msg.text}
						</div>
					</div>
				))}

				{/* Auto-scroll target */}
			</div>
		</div>
	);
}