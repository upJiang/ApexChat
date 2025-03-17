import { FormItemRule } from "naive-ui";
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";

export const useModel = () => {
	const route = useRoute();
	const formState = reactive({
		userPhoneNumber: "", // 手机号
		valiedateCode: "", // 验证码
		password1: "",
		password2: "",
		inviteUserId: (route.query?.inviteUserId as string) || "", // 邀请码
	});

	const currentTab = ref("register");

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
		submitLoading,
		currentTab,
		slideVerifyVisible,
		isSlideVerifySuccess,
	};
};

export type Model = ReturnType<typeof useModel>;
