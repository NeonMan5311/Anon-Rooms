import { useEffect, useState } from "react";
import { Copy, QrCode  as Qr_code} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import * as QRCode from "qrcode";
import { Button } from "./components/ui/button";
export function QrCode() {
	const [qrUrl, setQrUrl] = useState("");
	const link = window.location.href;
	console.log(link);
	useEffect(() => {
		let isMounted = true;

		QRCode.toDataURL(link)
			.then((url: string) => {
				if (isMounted) setQrUrl(url);
			})
			.catch((err: unknown) => {
				console.error("Failed to generate QR code:", err);
				if (isMounted) setQrUrl("");
			});

		return () => {
			isMounted = false;
		};
	}, [link]);

	if (!qrUrl) {
		return <div>Qr</div>;
	}

	return (
		<Dialog>
			<DialogTrigger>
				<Button
					variant="ghost"
					size="icon"
					className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10"
				>
					<Qr_code />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-fit px-10 bg-black/80 border border-white/10">
				<div className="flex items-center justify-center ">
					<img
						src={qrUrl}
						className="invert"
						alt="Room invite QR code"
					/>
				</div>
				<div className="flex items-center gap-2 p-1.5 pl-3 pr-1.5 rounded-lg bg-black/40 border border-white/5">
					<code className="flex-1 font-mono text-sm text-white/80 tracking-wide">
						{link}
					</code>
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10"
						onClick={()=>navigator.clipboard.writeText(link)}
					>
						<Copy className="w-3.5 h-3.5" />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
