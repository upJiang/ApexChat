import { FormItemRule } from "naive-ui";
import { computed, reactive, ref } from "vue";

import { useUserStore } from "@/store";

export const useModel = () => {
	const userStore = useUserStore();
	const userInfo = computed(() => userStore.userInfo);
	const formState = reactive({
		userPhoneNumber: "",
		valiedateCode: "",
	});

	const rules = {
		userPhoneNumber: {
			required: true,
			trigger: "change",
			validator: (_rule: FormItemRule, value: string) => {
				return new Promise<void>((resolve, reject) => {
					if (!value) {
						reject(Error("请输入新手机号"));
					} else if (!/^1[3456789]\d{9}$/.test(value)) {
						reject(Error("新手机号格式不正确"));
					} else {
						resolve();
					}
				});
			},
		},
		valiedateCode: {
			required: true,
			trigger: ["change"],
			validator: (_rule: FormItemRule, value: string) => {
				return new Promise<void>((resolve, reject) => {
					if (!value) {
						reject(Error("请输入短信验证码"));
					} else {
						resolve();
					}
				});
			},
		},
	};

	const submitLoading = ref(false);

	// 滑块验证弹窗
	const slideVerifyVisible = ref(false);
	const isSlideVerifySuccess = ref(false);

	return {
		formState,
		rules,
		userInfo,
		submitLoading,
		slideVerifyVisible,
		isSlideVerifySuccess,
	};
};

export type Model = ReturnType<typeof useModel>;
