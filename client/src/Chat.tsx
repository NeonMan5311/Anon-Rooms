import React from "react";
import { Button } from "./components/ui/button";
import { MessageList } from "./MessageList";
import { getBackendBaseUrl } from "@/lib/env";

type ChatProps = {
	roomId: string;
	participantCount: number;
	messages: {
		id: string;
		senderId: string;
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
	}[];
	userMap: Map<string, string>;
	onSend: (text: string) => void;
	onSendFile: (file: {
		fileUrl: string;
		fileName: string;
		fileSize: number;
		mimeType: string;
	}) => void;
};

export function Chat({
	roomId,
	participantCount,
	messages,
	onSend,
	onSendFile,
	userMap,
}: ChatProps) {
	const [message, setMessage] = React.useState("");
	const [uploadError, setUploadError] = React.useState<string | null>(null);
	const [uploadingFileName, setUploadingFileName] = React.useState<string | null>(
		null
	);
	const [isNearBottom, setIsNearBottom] = React.useState(true);
	const [unreadCount, setUnreadCount] = React.useState(0);
	const scrollRef = React.useRef<HTMLDivElement | null>(null);
	const fileInputRef = React.useRef<HTMLInputElement | null>(null);

	const backendBaseUrl = getBackendBaseUrl();

	const isSendDisabled = !message.trim() || Boolean(uploadingFileName);

	const scrollToBottom = React.useCallback((behavior: ScrollBehavior = "smooth") => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollTo({ top: el.scrollHeight, behavior });
	}, []);

	const checkNearBottom = React.useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
		setIsNearBottom(distanceFromBottom < 48);
	}, []);

	React.useEffect(() => {
		if (isNearBottom) {
			scrollToBottom("smooth");
			setUnreadCount(0);
		} else if (messages.length > 0) {
			setUnreadCount((prev) => prev + 1);
		}
	}, [messages, isNearBottom, scrollToBottom]);

	React.useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;
		el.addEventListener("scroll", checkNearBottom, { passive: true });
		return () => el.removeEventListener("scroll", checkNearBottom);
	}, [checkNearBottom]);

	const handleSend = () => {
		if (isSendDisabled) return;
		onSend(message.trim());
		setMessage("");
		setTimeout(() => scrollToBottom("smooth"), 0);
	};

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleAttachClick = () => {
		if (uploadingFileName) return;
		fileInputRef.current?.click();
	};

	const handleFileSelected = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const selectedFile = e.target.files?.[0];
		e.target.value = "";

		if (!selectedFile) return;

		setUploadError(null);
		setUploadingFileName(selectedFile.name);

		try {
			const formData = new FormData();
			formData.append("file", selectedFile);
			formData.append("roomId", roomId);

			const response = await fetch(`${backendBaseUrl}/upload`, {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error ?? "Upload failed");
			}

			onSendFile({
				fileUrl: result.fileUrl,
				fileName: result.fileName,
				fileSize: result.fileSize,
				mimeType: result.mimeType,
			});

			setTimeout(() => scrollToBottom("smooth"), 0);
		} catch (error) {
			const fallbackMessage = "Upload failed. Please try again.";
			setUploadError(
				error instanceof Error && error.message ? error.message : fallbackMessage
			);
		} finally {
			setUploadingFileName(null);
		}
	};

	return (
		<div className="flex h-full w-full min-h-0 flex-col overflow-hidden">
			<div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#171717]/95 px-6 py-3 backdrop-blur">
				<div className="text-sm font-medium text-white/90">Room {roomId}</div>
				<div className="flex items-center gap-3 text-xs text-white/60">
					<span>{participantCount} online</span>
					<span className="flex items-center gap-1 text-green-400">
						<span className="inline-block h-2 w-2 rounded-full bg-green-400" />
						Connected
					</span>
				</div>
			</div>

			{/* Messages */}
			<div ref={scrollRef} className="relative flex-1 min-h-0 overflow-y-auto px-6 pt-4">
				<MessageList messages={messages} userMap={userMap} />

				{!isNearBottom && unreadCount > 0 && (
					<button
						onClick={() => {
							scrollToBottom("smooth");
							setUnreadCount(0);
						}}
						className="sticky bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-zinc-900/95 px-3 py-1 text-xs text-white/90 shadow"
					>
						New messages ({unreadCount}) ↓
					</button>
				)}
			</div>

			{/* Input */}
			<div className="shrink-0 border-t border-white/10 p-4">
				<input
					ref={fileInputRef}
					type="file"
					onChange={handleFileSelected}
					className="hidden"
					accept=".jpg,.jpeg,.png,.webp,.pdf,.txt,.zip"
				/>
				<div className="flex items-end gap-2">
					<Button
						onClick={handleAttachClick}
						variant="secondary"
						disabled={Boolean(uploadingFileName)}
					>
						Attach
					</Button>
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={handleInputKeyDown}
						rows={1}
						className="max-h-32 min-h-[42px] flex-1 resize-none rounded-xl bg-black px-4 py-2 outline-none"
						placeholder="Type a message…"
					/>
					<Button onClick={handleSend} disabled={isSendDisabled}>
						{uploadingFileName ? "Uploading..." : "Send"}
					</Button>
				</div>
				{uploadingFileName && (
					<p className="mt-2 text-[11px] text-blue-300">
						Uploading {uploadingFileName}...
					</p>
				)}
				{uploadError && (
					<p className="mt-2 text-[11px] text-red-400">{uploadError}</p>
				)}
				<p className="mt-2 text-[11px] text-white/40">
					Enter to send • Shift+Enter for a new line
				</p>
			</div>
		</div>
	);
}
