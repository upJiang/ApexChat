import { useEncrypt } from "@/hooks/useEncryptor";
import { useUserStore } from "@/store/modules/user";
import { setCookie } from "@/utils/cookie";

import { fetchUserLogin } from "./api";
import type { Model } from "./model";

export default class Service {
	private model: Model;

	constructor(model: Model) {
		this.model = model;
	}

	// 登录
	async onSubmit() {
		try {
			this.model.submitLoading.value = true;
			// 加密密码
			const encryptPassword = !this.model.loginType.value
				? await useEncrypt(this.model.formState.userPassword)
				: undefined;

			const res = await fetchUserLogin({
				...this.model.formState,
				action: "login",
				userPassword: encryptPassword,
				loginType: this.model.loginType.value,
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
		} finally {
			this.model.submitLoading.value = false;
		}
	}
}
