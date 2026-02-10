import App from "./App";
import { CreateJoinModal } from "./CreateJoinModal";
import { getRoomId } from "./utils";

export function Entry() {
	const roomId = getRoomId();
	const showModal = !roomId;

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
