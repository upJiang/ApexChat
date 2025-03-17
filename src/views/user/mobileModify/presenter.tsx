import { useMessage } from "naive-ui";

import { useSendSms } from "@/hooks/useSendSms";
import { router } from "@/router";

import { useModel } from "./model";
import Service from "./service";

// 倒计时

export const usePresenter = () => {
	const model = useModel();
	const service = new Service(model);

	const message = useMessage();
	// 发送验证码
	const { inCodeSend, seconds } = useSendSms();
	inCodeSend.value = false;
	const handleGetSmsCode = () => {
		if (inCodeSend.value) {
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
				model.userInfo.value?.userPhoneNumber,
				message,
				"update",
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

	// 取消
	const handleOnCancel = () => {
		router.go(-1);
	};

	// 登录
	const handleOnSubmit = async () => {
		await service.userLogin();
		message.success("修改成功");
		handleOnCancel();
	};

	return {
		model,
		service,
		handleOnSubmit,
		handleGetSmsCode,
		inCodeSend,
		seconds,
		handleOnCancel,
		handleSlideVerifySuccess,
	};
};
