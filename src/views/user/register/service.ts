import { useEncrypt } from "@/hooks/useEncryptor";
import { useUserStore } from "@/store";
import { setCookie } from "@/utils/cookie";

import { fetchUserLogin } from "../login/api";
import { fetchUserRegister } from "./api";
import type { Model } from "./model";

export default class Service {
	private model: Model;

	constructor(model: Model) {
		this.model = model;
	}

	async onSubmit() {
		try {
			this.model.submitLoading.value = true;
			// 加密密码
			const encryptPassword = useEncrypt(this.model.formState.password1);
			await fetchUserRegister({
				...this.model.formState,
				userPassword: encryptPassword,
				action: "register",
			});
		} finally {
			this.model.submitLoading.value = false;
		}
	}

	// 登录
	async onLogin() {
		// 加密密码
		const encryptPassword = useEncrypt(this.model.formState.password1);

		const res = await fetchUserLogin({
			...this.model.formState,
			action: "login",
			userPassword: encryptPassword,
			loginType: 0,
		});
		if (res && res?.data) {
			const userStore = useUserStore();
			// 设置用户信息
			await userStore.handleUpdateUserInfo(
				{
					...res?.data?.userInfo,
					isLogin: true,
					updateType: 0,
				},
				false,
			);
			// 设置 token
			setCookie("access_token", res.data.userToken.split("Bearer ")[1]);
		}
	}
}
