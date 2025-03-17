import { useMessage } from "naive-ui";
import { useRouter } from "vue-router";

import { useSendSms } from "@/hooks/useSendSms";
import { useChatStore } from "@/store";

import { useModel } from "./model";
import Service from "./service";

// 倒计时

export const usePresenter = () => {
	const model = useModel();
	const service = new Service(model);
	const router = useRouter();

	const message = useMessage();
	const chatStore = useChatStore();

	const handleTabChange = (type: string) => {
		router.replace(`/${type}`);
	};

	// 切换登录方式
	const handleOnLoginTypeChange = () => {
		model.loginType.value = model.loginType.value ? 0 : 1;
	};

	// 登录
	const handleOnSubmit = async () => {
		await service.onSubmit();
		message.success("登录成功，欢迎使用");
		handleOnCancel();
	};

	// 取消
	const handleOnCancel = () => {
		router.replace("/chat/" + chatStore.active ?? "1002");
	};

	// 注册
	const handleOnRegister = () => {
		router.replace("/register");
	};

	// 忘记密码
	const handleOnForgetPassword = () => {
		router.replace("/findPassword");
	};

	// 发送验证码
	const { inCodeSend, seconds } = useSendSms();
	inCodeSend.value = false;
	const handleGetSmsCode = () => {
		if (inCodeSend.value) {
			return;
		}
		if (!model.formState.userPhoneNumber) {
			message.warning("请输入手机号");
			return;
		}
		if (!/^1[3456789]\d{9}$/.test(model.formState.userPhoneNumber)) {
			message.warning("请输入正确的手机号");
			return;
		}
		if (!model.isSlideVerifySuccess.value) {
			model.slideVerifyVisible.value = true;
			return;
		}
	};

	// 滑块验证码成功
	const handleSlideVerifySuccess = (slideVerifyCode: string) => {
		model.slideVerifyVisible.value = false;
		model.isSlideVerifySuccess.value = true;
		useSendSms()
			.handleGetSmsCode(
				model.formState.userPhoneNumber,
				message,
				"login",
				slideVerifyCode,
			)
			.then(() => {
				model.isSlideVerifySuccess.value = false;
			})
			.catch(() => {
				inCodeSend.value = false;
				model.isSlideVerifySuccess.value = false;
			});
	};

	return {
		model,
		service,
		handleOnSubmit,
		handleOnRegister,
		handleOnForgetPassword,
		handleOnLoginTypeChange,
		handleGetSmsCode,
		inCodeSend,
		seconds,
		handleTabChange,
		handleSlideVerifySuccess,
	};
};
