import { request } from "@/utils/newRequest";

export interface IFetchIntegralHistoryResult {
	code: number;
	msg: string;
	data: {
		total: number;
		records: {
			id: number; // 主键
			userId: number; // 用户id
			modelName: string; //  模型名称
			modelType: string; // 所属类别
			modelPrice: string; // 价格
			score: number; // 积分
			time: string; // 时间
		}[];
	};
}

interface IFetchIntegralHistoryParams {
	scoreSourceId?: string;
	pageNum: number;
	pageSize: number;
}

// 积分历史
export function fetchIntegralHistory(params: IFetchIntegralHistoryParams) {
	return request<IFetchIntegralHistoryResult>({
		url: `/gptservice/modelUseHistory/page`,
		method: "GET",
		params,
	});
}
