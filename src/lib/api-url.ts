const configuredApiUrl = process.env.NEXT_PUBLIC_SERVER_URL?.trim() || "";

export const API_BASE_URL = configuredApiUrl.replace(/\/+$/, "");
