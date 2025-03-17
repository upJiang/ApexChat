// 统一处理项目初始化，架构太乱，在hooks统一处理

import { homeStore } from "@/store";
import { useModelStore } from "@/store/modelStore";
import { useIntegralStore } from "@/store/modules/integral";

export const useInit = () => {
	// 获取用户积分信息
	const integralStore = useIntegralStore();
	integralStore.loadUserScoreDetail();
	// 获取可用模型列表
	const modelStore = useModelStore();
	modelStore.loadModelList();
	// 获取地址url
	const url = window.location.href;
	if (url.includes("/draw") || url.includes("/chat")) {
		// 滚动到底部
		setTimeout(() => {
			homeStore.setMyData({ act: "scrollToBottom" });
		}, 1200);
	}
};
