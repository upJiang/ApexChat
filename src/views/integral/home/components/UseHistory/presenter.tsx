import { useModel } from "./model";
import Service from "./service";

export const usePresenter = () => {
	const model = useModel();
	const service = new Service(model);

	// 重置
	const handleOnReset = () => {
		model.formState.scoreSourceId = undefined;
		model.pagination.pageNum = 1;
		model.pagination.total = 0;
		model.tableData.value = [];
		service.onSearch();
	};

	// 页数改动
	const handlePageChange = (pageNo: number) => {
		model.pagination.pageNum = pageNo;
		service.onSearch();
	};

	const handlePageSizeChange = (pageSize: number) => {
		model.pagination.pageSize = pageSize;
		model.pagination.pageNum = 1;
		service.onSearch();
	};

	// 搜索
	const handleOnSubmit = () => {
		model.pagination.pageNum = 1;
		service.onSearch();
	};

	service.onSearch();
	return {
		model,
		service,
		handleOnReset,
		handleOnSubmit,
		handlePageChange,
		handlePageSizeChange,
	};
};
