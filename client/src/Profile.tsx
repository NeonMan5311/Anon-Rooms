import React, { useState, useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
type ProfileProps = {
	onUpdateProfile: (data: {
		displayName?: string;
		avatar?: { seed: string };
	}) => void;
};
export function Profile({ onUpdateProfile }: ProfileProps) {
	function debounce(fn: Function, delay: number) {
		let timer: number | undefined;

		return (...args: any[]) => {
			clearTimeout(timer);
			timer = window.setTimeout(() => {
				fn(...args);
			}, delay);
		};
	}
	const debouncedProfileUpdate = React.useMemo(() => {
		return debounce(onUpdateProfile, 1500); // 1.5s
	}, [onUpdateProfile]);
	function throttle(fn: Function, limit: number) {
		let inThrottle = false;

		return (...args: any[]) => {
			if (!inThrottle) {
				fn(...args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		};
	}
	const throttledAvatarUpdate = React.useMemo(() => {
		return throttle((seed: string) => {
			onUpdateProfile({ avatar: { seed } });
		}, 2000); // 2s
	}, [onUpdateProfile]);




	const [name, setName] = useState("Joe");
	const [tempName, setTempName] = useState("Joe");
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState("");

	// 🔹 Avatar seed (deterministic input)
	const [avatarSeed, setAvatarSeed] = useState(() => crypto.randomUUID());

	const MAX_LENGTH = 10;

	// 🔹 Generate DiceBear SVG (deterministic)
	const avatarSvg = useMemo(() => {
		return createAvatar(notionists, {
			seed: avatarSeed,
		}).toString();
	}, [avatarSeed]);

	const handleNameChange = (e) => {
		const cleanInput = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
		setName(cleanInput);
		if (error) setError("");
	};

	const handleSubmit = () => {
		if (name.length < 3) {
			setError("Min 3 chars");
		} else {
			setError("");
			setTempName(name);
			setIsEditing(false);
		}
		debouncedProfileUpdate({ displayName: name });

	};

	const handleCancel = () => {
		setError("");
		setName(tempName);
		setIsEditing(false);
	};

	// 🔹 Randomize avatar (seed rotation)
	const randomizeAvatar = () => {
		const newSeed = crypto.randomUUID();
		setAvatarSeed(newSeed);
		throttledAvatarUpdate(newSeed);
	};

	return (
		<div className="flex flex-col gap-4 justify-center items-center h-full text-white">
			{/* Avatar (same size & shape, SVG instead of img) */}
			<div className="relative w-32 h-32">
				{/* Avatar */}
				<div
					className="w-32 h-32 rounded-full overflow-hidden bg-gray-300 border border-white"
					dangerouslySetInnerHTML={{ __html: avatarSvg }}
				/>
				{/* Presence indicator */}
				<div className="absolute bottom-0 left-3 w-8 h-8 flex justify-center items-center bg-[#171717] rounded-full">
					<div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
						<div className="w-2 h-2 rounded-full bg-[#171717]" />
					</div>
				</div>

				{/* Randomize button */}
				<button
					onClick={randomizeAvatar}
					title="Randomize avatar"
					className="
                        absolute bottom-0 right-2
                        w-8 h-8 rounded-full
                         border-white
                        text-xs text-white
                        flex items-center justify-center hover:border-white
                        transition-colors bg-[#171717]
		"
				>
					<svg
						fill="hsl(0,0%,100%)" // 2. Change this from #111 to currentColor
						viewBox="0 0 256 256"
						xmlns="http://www.w3.org/2000/svg"
						className="w-6 rounded-full"
					>
						<g fillRule="evenodd">
							<path d="M47.895 88.097c.001-4.416 3.064-9.837 6.854-12.117l66.257-39.858c3.785-2.277 9.915-2.277 13.707.008l66.28 39.934c3.786 2.28 6.853 7.703 6.852 12.138l-.028 79.603c-.001 4.423-3.069 9.865-6.848 12.154l-66.4 40.205c-3.781 2.29-9.903 2.289-13.69-.01l-66.167-40.185c-3.78-2.295-6.842-7.733-6.84-12.151l.023-79.72zm13.936-6.474l65.834 36.759 62.766-36.278-62.872-36.918L61.83 81.623zM57.585 93.52c0 1.628-1.065 71.86-1.065 71.86-.034 2.206 1.467 4.917 3.367 6.064l61.612 37.182.567-77.413s-64.48-39.322-64.48-37.693zm76.107 114.938l60.912-38.66c2.332-1.48 4.223-4.915 4.223-7.679V93.125l-65.135 37.513v77.82z" />
							<path d="M77.76 132.287c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526 3.038 5.261 1.623 11.765-3.16 14.526zm32 21c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526 3.038 5.261 1.623 11.765-3.16 14.526zm-32 16c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526 3.038 5.261 1.623 11.765-3.16 14.526zm32 21c-4.782 2.762-11.122.735-14.16-4.526-3.037-5.261-1.622-11.765 3.16-14.526 4.783-2.762 11.123-.735 14.16 4.526 3.038 5.261 1.623 11.765-3.16 14.526zm78.238-78.052c-4.783-2.762-11.122-.735-14.16 4.526-3.037 5.261-1.623 11.765 3.16 14.526 4.783 2.762 11.123.735 14.16-4.526 3.038-5.261 1.623-11.765-3.16-14.526zm-16.238 29c-4.782-2.762-11.122-.735-14.16 4.526-3.037 5.261-1.622 11.765 3.16 14.526 4.783 2.762 11.123.735 14.16-4.526 3.038-5.261 1.623-11.765-3.16-14.526zm-17 28c-4.782-2.762-11.122-.735-14.16 4.526-3.037 5.261-1.622 11.765 3.16 14.526 4.783 2.762 11.123.735 14.16-4.526 3.038-5.261 1.623-11.765-3.16-14.526zM128.5 69c-6.351 0-11.5 4.925-11.5 11s5.149 11 11.5 11S140 86.075 140 80s-5.149-11-11.5-11z" />
						</g>
					</svg>
				</button>
			</div>

			<div className="flex justify-center w-full">
				{isEditing ? (
					<div className="relative flex flex-col items-center">
						<input
							autoFocus
							type="text"
							value={name}
							maxLength={MAX_LENGTH}
							onChange={handleNameChange}
							onBlur={handleCancel}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleSubmit();
								if (e.key === "Escape") handleCancel();
							}}
							style={{
								width: `${
									Math.min(
										Math.max(name.length, 1),
										MAX_LENGTH
									) + 2
								}ch`,
							}}
							className={`
                                bg-transparent 
                                text-xl font-medium text-center 
                                outline-none p-0 min-w-5
                                border-b 
                                ${
									error
										? "border-red-500 text-red-400"
										: "border-zinc-500 text-white"
								}
                            `}
						/>
						{error && (
							<span className="absolute top-full mt-1 text-[10px] text-red-500 whitespace-nowrap">
								{error}
							</span>
						)}
					</div>
				) : (
					<div className="relative">
						<span className="text-xl font-medium text-white">
							{name}
						</span>
						<button
							onClick={() => {
								setTempName(name);
								setIsEditing(true);
							}}
							className="absolute -right-4 bottom-1 text-[10px] text-zinc-400 hover:text-white transition-colors leading-none"
						>
							✎
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
