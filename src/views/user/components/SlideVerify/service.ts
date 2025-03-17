import { fetchGetVerifyCode } from "./api";
import type { Model } from "./model";

export default class Service {
	private model: Model;

	constructor(model: Model) {
		this.model = model;
	}

	async getVerifyCode() {
		const res = await fetchGetVerifyCode();
		if (res) {
			this.model.verifyCode.value = res?.data;
		}
	}
}
