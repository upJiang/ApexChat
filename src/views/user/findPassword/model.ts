import { FormItemRule } from "naive-ui";
import { computed, reactive, ref } from "vue";

import { useUserStore } from "@/store";

export const useModel = () => {
	const userStore = useUserStore();
	const userInfo = computed(() => userStore.userInfo);

	const formState = reactive({
		userPhoneNumber: "",
		valiedateCode: "",
		password1: "",
		password2: "",
	});

	const rules = {
		userPhoneNumber: {
			required: true,
			trigger: "change",
			validator: (_rule: FormItemRule, value: string) => {
				return new Promise<void>((resolve, reject) => {
					if (!value) {
						reject(Error("请输入手机号"));
					} else if (!/^1[3456789]\d{9}$/.test(value)) {
						reject(Error("手机号格式不正确"));
					} else {
						resolve();
					}
				});
			},
		},
		valiedateCode: {
			required: true,
			message: "请输入短信验证码",
			trigger: ["change"],
		},
		password1: {
			required: true,
			trigger: ["change"],
			validator: (_rule: FormItemRule, value: string) => {
				return new Promise<void>((resolve, reject) => {
					if (!value) {
						reject(Error("请输入您的登录密码"));
					} else if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(value)) {
						reject(Error("密码格式不正确，至少包含字母及数字"));
					} else {
						resolve();
					}
				});
			},
		},
		password2: {
			required: true,
			trigger: ["change"],
			validator: (_rule: FormItemRule, value: string) => {
				return new Promise<void>((resolve, reject) => {
					if (!value) {
						reject(Error("请再次输入您的登录密码"));
					} else if (!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(value)) {
						reject(Error("密码格式不正确，至少包含字母及数字"));
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
		isSlideVerifySuccess,
		slideVerifyVisible,
	};
};

export type Model = ReturnType<typeof useModel>;
