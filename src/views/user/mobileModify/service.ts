import { useUserStore } from "@/store";

import type { Model } from "./model";

export default class Service {
	private model: Model;

	constructor(model: Model) {
		this.model = model;
	}

	// 修改绑定手机号
	async userLogin() {
		try {
			this.model.submitLoading.value = true;
			const userStore = useUserStore();
			await userStore.handleUpdateUserInfo({
				userPhoneNumber: this.model.formState.userPhoneNumber,
				valiedateCode: this.model.formState.valiedateCode,
				action: "update",
				updateType: 1,
			});
		} finally {
			this.model.submitLoading.value = false;
		}
	}
}
