import { request } from "@/utils/newRequest";

interface IFetchGetVerifyCodeResult {
	code: number;
	msg: string;
	data: string;
}

// 获取滑块验证码
export function fetchGetVerifyCode() {
	return request<IFetchGetVerifyCodeResult>({
		url: `/gptservice/auth/getverifyCode`,
		method: "GET",
	});
}
