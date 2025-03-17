import { delCookie } from "@/utils/cookie";

import { fetchUserLogout } from "./api";
import type { Model } from "./model";

export default class Service {
	private model: Model;

	constructor(model: Model) {
		this.model = model;
	}

	// 退出登录
	async onLogout() {
		await fetchUserLogout();
		delCookie("access_token");
	}
}
