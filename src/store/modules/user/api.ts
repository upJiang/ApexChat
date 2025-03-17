import { request } from "@/utils/newRequest";

export interface IFetchUserInfoUpdateParams {
	id: number; // 用户唯一标识
	userHead?: string; // 头像
	userName?: string; // 用户名
	userPassword?: string; // 密码
	userPhoneNumber: string;
	valiedateCode?: string; // 验证码
}

interface IFetchUserInfoUpdateResult {
	code: number;
	msg: string;
}

// 更新用户信息
export function fetchUserInfoUpdate(data: IFetchUserInfoUpdateParams) {
	return request<IFetchUserInfoUpdateResult>({
		url: `/gptservice/auth/updateUserInfo`,
		method: "PUT",
		data,
	});
}

// 更新用户密码
export function fetchUserInfoPasswordUpdate(data: IFetchUserInfoUpdateParams) {
	return request<IFetchUserInfoUpdateResult>({
		url: `/gptservice/auth/updateUserPwd`,
		method: "PUT",
		data,
	});
}
