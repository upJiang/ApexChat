import { defineStore } from "pinia";
import { ref } from "vue";

export const useGptsStore = defineStore(
	"gpts",
	() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const recentGpts = ref<any>([]); // 最近使用的gpts

		return {
			recentGpts,
		};
	},
	{
		persist: {
			enabled: true,
		},
	},
);
