import { ref } from "vue";

import { useBasicLayout } from "@/hooks/useBasicLayout";

import type { IFetchCreativeListResult } from "./api";

export const useModel = () => {
	// 搜索
	const searchVal = ref("");

	// 当前分类
	const currentClassify = ref("");

	const { isMobile } = useBasicLayout();

	// 分类列表
	const classifyList = ref<string[]>([]);
	const collectList = ref<number[]>([]);

	const creativeList = ref<IFetchCreativeListResult["data"]["records"]>([]);
	const creativeListTemp = ref<IFetchCreativeListResult["data"]["records"]>([]);
	const loading = ref(false);
	return {
		isMobile,
		searchVal,
		currentClassify,
		creativeList,
		creativeListTemp,
		classifyList,
		collectList,
		loading,
	};
};

export type Model = ReturnType<typeof useModel>;
