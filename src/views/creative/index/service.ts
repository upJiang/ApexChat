import { useUserStore } from "@/store/modules/user";

import {
	fetchCreativeCollectByUser,
	fetchCreativeCollectByUserList,
	fetchCreativeDelUser,
	fetchCreativeList,
} from "./api";
import type { Model } from "./model";

export default class Service {
	private model: Model;

	constructor(model: Model) {
		this.model = model;
	}

	// 收藏
	async onCollect(id) {
		const submitParams = {
			chuangZuoId: id,
			userId: useUserStore().userInfo.id,
		};
		if (this.model.collectList.value.includes(id)) {
			await fetchCreativeDelUser(submitParams);
			this.model.collectList.value = this.model.collectList.value.filter(
				(item) => item !== id,
			);
		} else {
			await fetchCreativeCollectByUser(submitParams);
			this.model.collectList.value.push(id);
		}
	}

	// 获取收藏列表
	async getCollectList() {
		const res = await fetchCreativeCollectByUserList(
			useUserStore().userInfo.id,
		);
		if (res?.data) {
			this.model.collectList.value = res.data;
		}
	}

	// 获取创作列表
	async getList() {
		try {
			this.model.loading.value = true;
			const res = await fetchCreativeList({
				pageNo: 1,
				pageSize: 1000,
			});
			if (res?.data) {
				this.model.creativeList.value = res.data.records;
				this.model.creativeList.value.forEach((item) => {
					if (!item.classify) {
						item.classify = "通用";
					}
				});
				this.model.creativeListTemp.value = JSON.parse(
					JSON.stringify(this.model.creativeList.value),
				);
				this.model.classifyList.value = this.model.creativeList.value.map(
					(item) => item.classify!,
				);
				// this.model.classifyList.value 去重
				this.model.classifyList.value = Array.from(
					new Set(this.model.classifyList.value),
				);
				this.model.classifyList.value.unshift("收藏");
			}
		} finally {
			this.model.loading.value = false;
		}
	}
}
