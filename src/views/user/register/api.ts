import { request } from "@/utils/newRequest";

interface IFetchUserRegisterParams {
	action?: string;
	userPassword: string; // 密码
	valiedateCode: string; // 验证码
	userPhoneNumber: string; // 手机号
	inviteUserId?: string; // 邀请码
}

interface IFetchUserRegisterResult {
	code: number;
	msg: string;
}

// 用户注册
export function fetchUserRegister(data: IFetchUserRegisterParams) {
	return request<IFetchUserRegisterResult>({
		url: `/gptservice/auth/register`,
		method: "POST",
		data,
	});
}
