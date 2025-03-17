import { useMessage } from "naive-ui";
import { useRouter } from "vue-router";

import { useSendSms } from "@/hooks/useSendSms";
import { useChatStore } from "@/store";

import { useModel } from "./model";
import Service from "./service";

export const usePresenter = () => {
	const model = useModel();
	const service = new Service(model);

	const router = useRouter();
	const message = useMessage();

	const chatStore = useChatStore();

	const handleTabChange = (type: string) => {
		router.replace(`/${type}`);
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
				"register",
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

	// 注册
	const handleOnSubmit = async () => {
		if (model.formState.password1 !== model.formState.password2) {
			return message.error("两次密码输入不一致");
		}
		await service.onSubmit();
		await service.onLogin();
		message.success("欢迎使用");
		router.replace("/chat/" + chatStore.active ?? "1002");
	};

	return {
		model,
		service,
		handleOnSubmit,
		handleGetSmsCode,
		inCodeSend,
		seconds,
		handleTabChange,
		handleSlideVerifySuccess,
	};
};
