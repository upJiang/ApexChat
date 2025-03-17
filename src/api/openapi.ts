import { ChatMessage } from "gpt-tokenizer/esm/GptEncoding";

import {
	useGPTSubmitSuccessCallback,
	useSubmitErrorCallback,
} from "@/hooks/useGPTSubmitCallback";
import { gptConfigStore, gptServerStore, homeStore } from "@/store";
import { useModelStore } from "@/store/modelStore";
import { getCookie } from "@/utils/cookie";
import { isNumber, isObject } from "@/utils/is";

import { chatSetting } from "./chat";
import { fetchImageGenerations } from "./common";
import { fetchSSE } from "./sse/fetchsse";

export const KnowledgeCutOffDate: Record<string, string> = {
	default: "2021-09",
	"gpt-4-1106-preview": "2023-04",
	"gpt-4-vision-preview": "2023-04",
};

const getUrl = (url: string) => {
	return `/gptservice${url}`;
};
export const gptGetUrl = getUrl;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subGPT = async (data: any, chat: Chat.Chat) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	const action = data.action;
	if (action === "gpt.dall-e-3") {
		//执行变化
		try {
			const d = await fetchImageGenerations(data.data);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const rz: any = d.data[0];
			chat.text = rz.revised_prompt ?? `图片已完成`;
			chat.opt = { imageUrl: rz.url };
			chat.loading = false;
			homeStore.setMyData({ act: "updateChat", actData: chat });
			homeStore.setMyData({ act: "scrollToBottom" });
			// 统一处理成功回调
			useGPTSubmitSuccessCallback("generations", {
				model: data.action,
				messages: data.data.prompt,
			});
			console.log(d);
		} catch (e) {
			chat.text = "抱歉，暂无结果，请重新输入";
			chat.loading = false;
			homeStore.setMyData({
				act: "updateChat",
				actData: chat,
				requestError: Math.random(),
			});
			// 失败回调，之后尝试调用别的模型
			useSubmitErrorCallback("generations");
			return Promise.reject("抱歉，暂无结果，请重新输入");
		}
	}
};

interface subModelType {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	message: any[];
	onMessage: (d: { text: string; isFinish: boolean }) => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onError?: (d?: any) => void;
	signal?: AbortSignal;
	model?: string;
}

export const getSystemMessage = (uuid?: number) => {
	//KnowledgeCutOffDate
	let sysTem = gptConfigStore.myData.systemMessage;
	if (uuid) {
		const chatS = new chatSetting(uuid);
		sysTem = chatS.getGptConfig().systemMessage;
	}
	if (sysTem) return sysTem;
	const model = gptConfigStore.myData.model
		? gptConfigStore.myData.model
		: useModelStore().defaultModel;
	const DEFAULT_SYSTEM_TEMPLATE = `You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: ${KnowledgeCutOffDate[model]}
Current model: ${model}
Current time: ${new Date().toLocaleString()}
Latex inline: $x^2$
Latex block: $$e=mc^2$$`;
	return DEFAULT_SYSTEM_TEMPLATE;
};
export const subModel = async (opt: subModelType) => {
	const curretModel = useModelStore().modelList.find(
		(item) => item.modelName === gptConfigStore.myData.model,
	);

	const model =
		opt.model ??
		(gptConfigStore.myData.model
			? gptConfigStore.myData.model
			: useModelStore().defaultModel);

	const body = {
		max_tokens:
			gptConfigStore.myData?.gpts &&
			gptConfigStore.myData?.gptsType === "creative" &&
			gptConfigStore.myData?.maxTokens
				? gptConfigStore.myData?.maxTokens
				: curretModel?.tokenLimit,
		rpm:
			gptConfigStore.myData?.gpts &&
			gptConfigStore.myData?.gptsType === "creative" &&
			gptConfigStore.myData?.rpm
				? gptConfigStore.myData?.rpm
				: curretModel?.rpm,
		presence_penalty:
			gptConfigStore.myData?.gpts &&
			gptConfigStore.myData?.gptsType === "creative" &&
			gptConfigStore.myData?.presencePenalty
				? gptConfigStore.myData?.presencePenalty
				: undefined,
		model,
		temperature: gptConfigStore.myData?.temperature || 0.5,
		frequency_penalty:
			gptConfigStore.myData?.gpts &&
			gptConfigStore.myData?.gptsType === "creative" &&
			gptConfigStore.myData?.frequencyPenalty
				? gptConfigStore.myData?.frequencyPenalty
				: undefined,
		history_message_count:
			gptConfigStore.myData?.gpts &&
			gptConfigStore.myData?.gptsType === "creative" &&
			gptConfigStore.myData?.historyMessageCount
				? gptConfigStore.myData?.historyMessageCount
				: undefined,
		top_p: 1,
		messages: opt.message,
		stream: true,
		sendMemory:
			gptConfigStore.myData?.gpts &&
			gptConfigStore.myData?.gptsType === "creative" &&
			gptConfigStore.myData?.sendMemory &&
			gptConfigStore.myData?.sendMemory === "true"
				? true
				: undefined,
	};
	//
	const token = getCookie("access_token");

	try {
		await fetchSSE(gptGetUrl("/v1/chat/completions"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "text/event-stream",
				Authorization: `Bearer ${token}`,
			},
			signal: opt.signal,
			// eslint-disable-next-line require-await
			onMessage: async (data: string) => {
				if (data === "[DONE]") opt.onMessage({ text: "", isFinish: true });
				else {
					const obj = JSON.parse(data);
					opt.onMessage({
						text: obj.choices[0].delta?.content ?? "",
						isFinish: obj.choices[0].finish_reason !== null,
					});
				}
			},
			onError(e) {
				opt.onError && opt.onError(e);
			},
			body: JSON.stringify(body),
		});
		// 统一处理成功回调
		useGPTSubmitSuccessCallback("completions", {
			messages: opt.message,
			model: opt.model!,
		});
	} catch (error) {
		opt.onError && opt.onError(error);
	}
};

export const getInitChat = (txt: string) => {
	const promptMsg: Chat.Chat = {
		dateTime: new Date().toLocaleString(),
		text: txt,
		inversion: true,
		error: false,
		conversationOptions: null,
		requestOptions: { prompt: txt, options: null },
	};
	return promptMsg;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const openaiSetting = (q: any) => {
	if (q.settings) {
		try {
			const obj = JSON.parse(q.settings);
			const url = obj.url ?? undefined;
			const key = obj.key ?? undefined;
			//let setQ= { }
			gptServerStore.setMyData({
				OPENAI_API_BASE_URL: url,
				MJ_SERVER: url,
				OPENAI_API_KEY: key,
				MJ_API_SECRET: key,
			});
			gptServerStore.setMyData(gptServerStore.myData);
		} catch (error) {}
	} else if (isObject(q)) {
		gptServerStore.setMyData(q);
		//gptServerStore.setMyData( gptServerStore.myData );
		gptServerStore.setMyData(gptServerStore.myData);
	}
};

export const encodeAsync = async () => {
	const { encode } = await import("gpt-tokenizer");

	return encode; //(str).length;
};
export const encodeChatAsync = async () => {
	const { encodeChat } = await import("gpt-tokenizer");

	return encodeChat; //(obj,model ).length;
};

export const getHistoryMessage = (
	dataSources: Chat.Chat[],
	loadingCnt = 1,
	start = 1000,
) => {
	let i = 0;
	const rz: ChatMessage[] = [];
	//const loadingCnt= 1;// 1就是没有loading，3 就是有loading
	const istart =
		isNumber(start) && start >= 0
			? Math.min(start, dataSources.length - loadingCnt)
			: dataSources.length - loadingCnt;
	for (let ii = istart; ii >= 0; ii--) {
		//let o of dataSources.value
		if (i >= gptConfigStore.myData.talkCount) break;
		i++;

		const o = dataSources[ii];
		//mlog('o',ii ,o);
		const content = o?.text;

		//mlog('d',gptConfigStore.myData.talkCount ,i ,o.inversion , o.text);
		rz.push({ content, role: o?.inversion ? "assistant" : "user" });
	}
	rz.reverse();
	return rz;
};
