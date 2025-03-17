import { FormItemRule } from "naive-ui";
import { reactive, ref } from "vue";

export const useModel = () => {
	const modalShow = ref(false);

	const currentTab = ref("login");

	// 登录方式  0:密码登录 1:短信登录
	const loginType = ref(0);

	const formState = reactive({
		userPhoneNumber: "",
		userPassword: "",
		valiedateCode: "",
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
		userPassword: {
			required: true,
			trigger: ["change"],
			validator: (_rule: FormItemRule, value: string) => {
				return new Promise<void>((resolve, reject) => {
					if (!loginType.value && !value) {
						reject(Error("请输入您的登录密码"));
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
					if (loginType.value && !value) {
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
		modalShow,
		formState,
		rules,
		loginType,
		submitLoading,
		currentTab,
		slideVerifyVisible,
		isSlideVerifySuccess,
	};
};

export type Model = ReturnType<typeof useModel>;
