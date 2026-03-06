function trimTrailingSlash(value: string) {
	return value.replace(/\/$/, "");
}

const isProd = import.meta.env.MODE === "production";

export function getBackendBaseUrl() {
	const raw = isProd
		? import.meta.env.VITE_BACKEND_URL_PROD
		: import.meta.env.VITE_BACKEND_URL_DEV;

	return trimTrailingSlash(raw);
}

export function getFrontendBaseUrl() {
	const raw = isProd
		? import.meta.env.VITE_FRONTEND_URL_PROD
		: import.meta.env.VITE_FRONTEND_URL_DEV;

	return trimTrailingSlash(raw);
}
