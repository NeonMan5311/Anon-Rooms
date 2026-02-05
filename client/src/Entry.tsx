import { useState } from "react";
import App from "./App";
import { CreateJoinModal } from "./CreateJoinModal";
import { getRoomId } from "./utils";

export function Entry() {
	const roomId = getRoomId();
	const [showModal, setShowModal] = useState(!roomId);

	if (showModal) {
		return (
			<CreateJoinModal
				onCreate={(roomId) => {
					window.location.href = `/?room=${roomId}`;
				}}
				onJoin={(roomId) => {
					window.location.href = `/?room=${roomId}`;
				}}
			/>
		);
	}

	return <App />;
}
