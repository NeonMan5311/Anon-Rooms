import { notionists } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMemo } from "react";
import { TbMicrophoneFilled, TbMicrophoneOff } from "react-icons/tb";
import { HiMiniSpeakerWave } from "react-icons/hi2";

type ParticipantCardProps = {
	user: {
		id: string;
		name: string;
		avatar: { seed: string };
		micOn: boolean;
	};
	onToggleMic: (enabled: boolean) => void;
};

export function ParticipantCard({ user, onToggleMic }: ParticipantCardProps) {
	const avatarSvg = useMemo(() => {
		return createAvatar(notionists, {
			seed: user.avatar.seed,
		}).toString();
	}, [user.avatar.seed]);

	return (
		<div className="h-15 w-full flex flex-row items-center justify-between px-2 py-3 text-sm text-white/95 border-b border-white/10">
			{/* Avatar */}
			<div
				className="h-10 w-10 rounded-full overflow-hidden"
				dangerouslySetInnerHTML={{ __html: avatarSvg }}
			/>

			{/* Name */}
			<div className="text-sm font-mono truncate flex-1 px-2">
				{user.name}
			</div>

			{/* Mic */}
			<button
				onClick={() => onToggleMic(!user.micOn)}
				className="rounded-full p-2 hover:bg-white/10"
			>
				{user.micOn ? (
					<TbMicrophoneFilled className="h-4 w-4 text-green-400" />
				) : (
					<TbMicrophoneOff className="h-4 w-4 text-white/50" />
				)}
			</button>

			{/* Speaker icon (listen-only indicator) */}
			{!user.micOn && (
				<div className="pl-1 text-white/40">
					<HiMiniSpeakerWave />
				</div>
			)}
		</div>
	);
}
