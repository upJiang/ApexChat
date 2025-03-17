import { defineStore } from "pinia";
import { ref } from "vue";

import {
	fetchUserInfoPasswordUpdate,
	fetchUserInfoUpdate,
	IFetchUserInfoUpdateParams,
} from "./api";

export interface UserInfo extends IFetchUserInfoUpdateParams {
	action?: string;
	id: number; // 用户唯一标识
	userHead: string; // 头像
	userName: string; // 用户名
	userPassword: string; // 密码
	isLogin: boolean;
	userPhoneNumber: string;
	updateType?: number; // 1 需要短信 0 不需要短信
}

const defaultSetting = {
	id: 0,
	userPhoneNumber: "",
	userPassword: "",
	isLogin: false,
	userHead: "",
	userName: "",
};

export const useUserStore = defineStore(
	"userStore",
	() => {
		// 主动弹起登录，变化了就弹起
		const showLogin = ref(0);
		const userInfo = ref<UserInfo>(JSON.parse(JSON.stringify(defaultSetting)));
		const handleUpdateUserInfo = async (
			info: Partial<UserInfo>,
			needRequest = true,
			modifyPassword = false, // 是否是修改密码，修改密码调别的接口
		) => {
			const newInfo = {
				...userInfo.value,
				...info,
			};
			// 需要调用接口
			if (needRequest) {
				modifyPassword && (await fetchUserInfoPasswordUpdate(newInfo));
				!modifyPassword && (await fetchUserInfoUpdate(newInfo));
			}

			userInfo.value = newInfo;
		};

		// 重置用户信息
		const resetUserInfo = () => {
			userInfo.value = defaultSetting;
			console.log("重置", userInfo.value);
		};

		return {
			showLogin,
			userInfo,
			handleUpdateUserInfo,
			resetUserInfo,
		};
	},
	{
		persist: { enabled: true },
	},
);
