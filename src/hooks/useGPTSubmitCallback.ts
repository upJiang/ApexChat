//统一封装调用 GPT 成功后的回调处理，包括聊天记录上报，积分消耗等
// import dayjs from "dayjs";

import { useIntegralStore } from "@/store/modules/integral";

// import { fetchChatHistoryUpload } from "@/api/common";
// import { useChatStore, useUserStore } from "@/store";

// 目前入口，聊天输入框 + dall.e 图片生成
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useGPTSubmitSuccessCallback = (
	type: string,
	data: {
		// 针对 v1/chat/completions 返回的数据
		model: string;
		messages:
			| {
					content: string;
					role: "system" | "user" | "assistant";
			  }[]
			| string;
	},
) => {
	// 获取用户积分信息
	const integralStore = useIntegralStore();
	integralStore.loadUserScoreDetail();
	// 获取当前时间
	// const chatStore = useChatStore();
	// const userStore = useUserStore();
	// const chatId = chatStore.active ?? "1002";
	// console.log("data", data);

	// // 上传聊天记录
	// await fetchChatHistoryUpload({
	// 	userId: userStore.userInfo.id,
	// 	chatId,
	// 	model: data.model,
	// 	charContent:
	// 		typeof data.messages === "string"
	// 			? data.messages
	// 			: data.messages.length > 2
	// 			? data.messages[data.messages.length - 2].content
	// 			: data.messages[1].content,
	// 	charTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
	// 	charFrom: 1,
	// });
	console.log("统一处理", type, data);

	return {};
};

// GPT 失败统一处理，尝试调用别的模型
export const useSubmitErrorCallback = (type: string) => {
	console.log("失败重连", type);
};
