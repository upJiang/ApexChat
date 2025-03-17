import { computed, reactive, ref } from "vue";

import { useIntegralStore } from "@/store/modules/integral";

import type { IFetchIntegralHistoryResult } from "./api";

export const useModel = () => {
	const integralStore = useIntegralStore();
	// 积分信息
	const userIntegralInfo = computed(() => integralStore.userIntegralInfo);

	const formState = reactive({
		scoreSourceId: undefined,
	});

	const pagination = reactive({
		pageNum: 1,
		pageSize: 10,
		total: 0,
	});

	const scoreSourceList = [
		{
			label: "注册赠送",
			value: 1,
		},
		{
			label: "api消耗",
			value: 2,
		},
		{
			label: "邀请注册奖励",
			value: 3,
		},
		{
			label: "邀请码注册",
			value: 4,
		},
		{
			label: "微信机器人消耗",
			value: 5,
		},
		{
			label: "cdkey兑换",
			value: 6,
		},
	];

	const tableData = ref<IFetchIntegralHistoryResult["data"]["records"]>([]);
	const tableLoading = ref(false);
	return {
		formState,
		tableData,
		pagination,
		scoreSourceList,
		userIntegralInfo,
		tableLoading,
	};
};

export type Model = ReturnType<typeof useModel>;
