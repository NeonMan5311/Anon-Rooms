// utils/room.ts
export function getRoomId() {
	const params = new URLSearchParams(window.location.search);
	return params.get("room");
}
export function getClientId() {
	let id = sessionStorage.getItem("clientId");
	if (!id) {
		id = crypto.randomUUID();
		sessionStorage.setItem("clientId", id);
	}
	return id;
}
