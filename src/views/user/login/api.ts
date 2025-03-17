import { request } from "@/utils/newRequest";

interface IFetchUserLoginParams {
	userPassword?: string; // 密码
	valiedateCode?: string; // 验证码
	userPhoneNumber: string; // 手机号
	loginType: number; // 登录方式  0:密码登录 1:短信登录
	action?: string; // logon
	slideVerifyCode?: string; // 仅短信登录需要
}

interface IFetchUserLoginResult {
	code: number;
	msg: string;
	data: {
		userToken: string;
		userInfo: {
			id: number; // 用户唯一标识
			userHead?: string; // 头像
			userName?: string; // 用户名
			userPassword?: string; // 密码
			userPhoneNumber: string;
		};
	};
}

// 用户注册
export function fetchUserLogin(data: IFetchUserLoginParams) {
	return request<IFetchUserLoginResult>({
		url: `/gptservice/auth/login`,
		method: "POST",
		data,
	});
}
