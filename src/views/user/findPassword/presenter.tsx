import { useMessage } from "naive-ui";
import { watch } from "vue";
import { useRouter } from "vue-router";

import { useSendSms } from "@/hooks/useSendSms";
import { useUserStore } from "@/store";

import { useModel } from "./model";
import Service from "./service";

export const usePresenter = () => {
	const model = useModel();
	const service = new Service(model);

	const router = useRouter();

	const userStoreState = useUserStore();
	const message = useMessage();

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

	// 提交
	const handleOnSubmit = () => {
		try {
			model.submitLoading.value = true;
			userStoreState.handleUpdateUserInfo(
				{
					action: "update",
					userPhoneNumber: model.formState.userPhoneNumber,
					valiedateCode: model.formState.valiedateCode,
					userPassword: model.formState.password1,
					updateType: 1,
				},
				true,
				true,
			);
			message.success("密码重置成功");
			router.replace("/login");
		} finally {
			model.submitLoading.value = false;
		}
	};

	// 取消
	const handleOnCancel = () => {
		router.go(-1);
	};

	// 返回登录
	const handleRebackLogin = () => {
		router.replace("/login");
	};

	watch(
		() => model.userInfo.value.userPhoneNumber,
		() => {
			if (model.userInfo.value.userPhoneNumber) {
				model.formState.userPhoneNumber = model.userInfo.value.userPhoneNumber;
			}
		},
		{
			immediate: true,
		},
	);

	return {
		model,
		service,
		handleOnSubmit,
		handleRebackLogin,
		handleGetSmsCode,
		inCodeSend,
		seconds,
		handleOnCancel,
		handleSlideVerifySuccess,
	};
};
