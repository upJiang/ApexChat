import { defineStore } from "pinia";
import { ref } from "vue";

import {
	fetchUserScoreDetail,
	type IFetchUserScoreDetailResult,
} from "@/views/integral/home/components/RulesAndBug/api";

export const useIntegralStore = defineStore(
	"integral",
	() => {
		// 当前用户积分信息
		const userIntegralInfo = ref<IFetchUserScoreDetailResult["data"]>();

		const loadUserScoreDetail = async () => {
			// 获取用户当前积分信息
			const res = await fetchUserScoreDetail();
			if (res?.data) {
				userIntegralInfo.value = res.data;
			}
		};
		return {
			userIntegralInfo,
			loadUserScoreDetail,
		};
	},
	{
		persist: {
			enabled: true,
		},
	},
);
