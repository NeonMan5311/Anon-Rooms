import { getBackendBaseUrl } from "@/lib/env";

type Message = {
	id: string;
	senderId: string;
	senderName?: string;
	text: string;
	timestamp: number;
	type?: "text" | "file";
	file?: {
		url: string;
		name: string;
		size: number;
		mimeType: string;
	};
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

function formatFileSize(size: number) {
	if (size < 1024) return `${size} B`;
	if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
	return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function resolveFileUrl(url: string) {
	if (url.startsWith("http://") || url.startsWith("https://")) {
		return url;
	}

	const backendBaseUrl = getBackendBaseUrl();
	return `${backendBaseUrl}${url}`;
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

						{msg.type === "file" && msg.file ? (
							<div
								className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
									msg.isMe
										? "bg-white text-black rounded-tr-sm"
										: "bg-zinc-800 text-white rounded-tl-sm"
								}`}
							>
								<div className="font-medium break-words">📎 {msg.file.name}</div>
								<div className="mt-1 text-xs opacity-70">
									{formatFileSize(msg.file.size)} • {msg.file.mimeType}
								</div>
								<a
									href={resolveFileUrl(msg.file.url)}
									target="_blank"
									rel="noreferrer"
									download={msg.file.name}
									className={`mt-2 inline-block text-xs underline ${
										msg.isMe ? "text-black/80" : "text-white/90"
									}`}
								>
									Download file
								</a>
							</div>
						) : (
							<div
								className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
									msg.isMe
										? "bg-white text-black rounded-tr-sm"
										: "bg-zinc-800 text-white rounded-tl-sm"
								} whitespace-pre-wrap break-words`}
							>
								{msg.text}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
