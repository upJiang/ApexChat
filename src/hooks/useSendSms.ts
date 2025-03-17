import { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";
import { ref } from "vue";

import { fetchSendMsg } from "@/api/common";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let timer: any = 0;
// 短信验证码是否发送中
const inCodeSend = ref(false);
// 倒计时
const seconds = ref(60);
export const useSendSms = () => {
	const countDown = () => {
		seconds.value = 60;
		timer = setInterval(() => {
			if (seconds.value > 0) seconds.value--;
			else {
				clearInterval(timer);
				timer = 0;
				inCodeSend.value = false;
			}
		}, 1000);
	};

	const handleGetSmsCode = (
		mobile: string,
		message: MessageApiInjection,
		action: string,
		slideVerifyCode: string,
	) => {
		return new Promise<void>(async (resolve, reject) => {
			if (inCodeSend.value) return;
			try {
				// 发送验证码
				await fetchSendMsg({
					userPhoneNumber: mobile,
					action,
					verifyCode: slideVerifyCode,
				});
				message.success("验证码已发送");
				inCodeSend.value = true;
				countDown();
				resolve();
			} catch (error) {
				reject();
			}
		});
	};

	return { inCodeSend, seconds, handleGetSmsCode };
};
