import { fetchIntegralHistory } from "./api";
import type { Model } from "./model";

export default class Service {
	private model: Model;

	constructor(model: Model) {
		this.model = model;
	}

	// 搜索
	async onSearch() {
		try {
			this.model.tableLoading.value = true;
			const res = await fetchIntegralHistory({
				...this.model.pagination,
				...this.model.formState,
			});
			if (res.data) {
				this.model.tableData.value = res.data.records;
				this.model.pagination.total = res.data?.total;
				console.log(this.model.pagination.total);
			}
		} finally {
			this.model.tableLoading.value = false;
		}
	}
}
