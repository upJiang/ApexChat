import type { AxiosProgressEvent, GenericAbortSignal } from "axios";

import { useAuthStore, useSettingStore } from "@/store";
import post from "@/utils/request";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fetchChatAPIProcess<T = any>(params: {
	prompt: string;
	options?: { conversationId?: string; parentMessageId?: string };
	signal?: GenericAbortSignal;
	onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}) {
	const settingStore = useSettingStore();
	const authStore = useAuthStore();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let data: Record<string, any> = {
		prompt: params.prompt,
		options: params.options,
	};

	if (authStore.isChatGPTAPI) {
		data = {
			...data,
			systemMessage: settingStore.systemMessage,
			temperature: settingStore.temperature,
			top_p: settingStore.top_p,
		};
	}

	return post<T>({
		url: "/chat-process",
		data,
		signal: params.signal,
		onDownloadProgress: params.onDownloadProgress,
	});
}

export * from "./chat";
export * from "./mj";
export * from "./mjsave";
export * from "./openapi";
export * from "./sse/fetchsse";
export * from "./units";
