import { message } from "@/hooks/useNaiveUIProvider";
import { useUserStore } from "@/store";
import { delCookie } from "@/utils/cookie";
// 未登录弹出登录弹窗
export const checkLoginShow = (noLogin = false) => {
	const userStore = useUserStore();
	if (!userStore.userInfo.isLogin || noLogin) {
		userStore.showLogin++;
		userStore.resetUserInfo();
		delCookie("access_token");
		message.error("请登录后操作哦~");
		return false;
	}
	return true;
};
