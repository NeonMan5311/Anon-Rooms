import { notionists } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useState, useMemo } from "react";
import {
	TbMicrophoneFilled,
	TbMicrophoneOff,
} from "react-icons/tb";
import { HiMiniSpeakerWave } from "react-icons/hi2";
export function ParticipantCard() {
	
	const gradients = [
		"linear-gradient(135deg, #1CB5E0, #000851)",
		"linear-gradient(135deg, #7F00FF, #E100FF)",
		"linear-gradient(135deg, #11998E, #38EF7D)",
		"linear-gradient(135deg, #FF512F, #DD2476)",
		"linear-gradient(135deg, #00C6FF, #0072FF)",
		"linear-gradient(135deg, #00F260, #0575E6)",
		"linear-gradient(135deg, #EC008C, #FC6767)",
		"linear-gradient(135deg, #F00000, #DC281E)",
		"linear-gradient(135deg, #1D976C, #93F9B9)",
		"linear-gradient(135deg, #3A1C71, #00DBDE)",
		"linear-gradient(90deg, #efd5ff 0%, #515ada 100%)",
	];

	const [bg, setBg] = useState(
		() => gradients[Math.floor(Math.random() * gradients.length)]
	);


	const [avatarSeed] = useState(() => crypto.randomUUID());
	const avatarSvg = useMemo(() => {
		return createAvatar(notionists, {
			seed: avatarSeed,
		}).toString();
	}, [avatarSeed]);
	return (
		<div
			className={`h-15 w-full flex felx-row justify-between items-center px-2 py-5 text-sm text-white/95 border-b border-white/10 space`}
		>
			<div
				className={`h-10 w-10 rounded-full overflow-hidden `}
				style={{
					background: bg,
					boxShadow: "0 0 18px rgba(0,0,0,0.35)",
				}}
				dangerouslySetInnerHTML={{ __html: avatarSvg }}
			></div>
			<div className="text-sm min-w-30  font-extralight font-mono overflow-hidden">
				1234567890-100
			</div>
			<div className=" rounded-full p-2">
				{/* <TbMicrophoneFilled /> */}
				<TbMicrophoneOff className="h-4 w-4" />
			</div>
			<div>
				<HiMiniSpeakerWave />
			</div>
		</div>
	);
}
