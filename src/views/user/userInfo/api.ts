import { request } from "@/utils/newRequest";

interface IFetchUserLogoutResult {
	code: number;
	msg: string;
}

// 用户退出登录
export function fetchUserLogout() {
	return request<IFetchUserLogoutResult>({
		url: `/gptservice/auth/logout`,
		method: "GET",
	});
}
