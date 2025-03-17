import { defineStore } from "pinia";
import { ref } from "vue";

import { fetchModelList, IFetchModelListResult } from "@/api/common";

export const useModelStore = defineStore(
	"model",
	() => {
		const defaultModel = ref("");

		// 当前模型列表
		const modelList = ref<IFetchModelListResult["data"]["records"]>([]);

		const loadModelList = async () => {
			// 获取模型列表
			const res = await fetchModelList({
				pageNo: 1,
				pageSize: 1000,
			});
			if (res?.data) {
				modelList.value = res.data.records
					.filter((it) => it.status)
					.map((item) => {
						return {
							...item,
							label: item.modelType,
							value: item.modelName,
						};
					});
				defaultModel.value =
					modelList.value.find((item) => item.isDefault)?.modelName || "";
			}
		};
		return {
			modelList,
			loadModelList,
			defaultModel,
		};
	},
	{
		persist: {
			enabled: true,
		},
	},
);
