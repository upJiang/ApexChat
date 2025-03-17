import { request } from "@/utils/newRequest";

export interface IFetchModelAddResult {
	code: number;
	msg: string;
}

interface IFetchCreativeCollectByUserParams {
	chuangZuoId: number; // 创作id
	userId: number; // 用户id
}
// 根据用户id,用户添加创作收藏
export function fetchCreativeCollectByUser(
	data: IFetchCreativeCollectByUserParams,
) {
	return request<IFetchModelAddResult>({
		url: `/gptservice/creativeCollectByUser/collectByUser`,
		method: "POST",
		data,
	});
}
// 根据用户id,用户删除创作收藏
export function fetchCreativeDelUser(data: IFetchCreativeCollectByUserParams) {
	return request<IFetchModelAddResult>({
		url: `/gptservice/creativeCollectByUser`,
		method: "DELETE",
		data,
	});
}

interface IFetchCreativeCollectByUserListResult {
	code: number;
	msg: string;
	data: number[];
}
// 根据同户token,用户创作收藏列表，返回id数组即可
export function fetchCreativeCollectByUserList(userId: number) {
	return request<IFetchCreativeCollectByUserListResult>({
		url: `/gptservice/creativeCollectByUser`,
		method: "GET",
		params: {
			userId,
		},
	});
}

export interface IFetchCreativeListResult {
	code: number;
	msg: string;
	data: {
		records: {
			id?: number;
			classify?: string; // 分类名称
			avatar?: string; // 头像字符串
			name?: string; // 创作名称
			description?: string; // 创作描述
			modelConfig?: {
				model?: string; // 模型名称
				temperature?: number;
				max_tokens?: number;
				presence_penalty?: number;
				frequency_penalty?: number;
				sendMemory?: boolean;
				historyMessageCount?: number;
				compressMessageLengthThreshold?: number;
			};
			context?: {
				role?: "user" | "system" | "assistant"; // 角色
				content?: string; // 预置词
			}[];
		}[];
		total: number;
	};
}

interface IFetchCreativeListParams {
	pageNo: number;
	pageSize: number;
	classify?: string; // 分类名称
	name?: string; // 创作名称
}

// 获取创作分页列表
export function fetchCreativeList(params: IFetchCreativeListParams) {
	return request<IFetchCreativeListResult>({
		url: `/gptservice/creative`,
		method: "GET",
		params,
	});
}
