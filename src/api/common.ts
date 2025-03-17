import { request } from "@/utils/newRequest";

interface IFetchSendMsgParams {
	userPhoneNumber: string; // 手机号
	action: string; // 类型 action：register、login、update
	verifyCode?: string; // 滑块验证码
}

interface IFetchSendMsgResult {
	code: number;
	msg: string;
	data: {
		code: string;
	};
}

// 获取短信
export function fetchSendMsg(data: IFetchSendMsgParams) {
	return request<IFetchSendMsgResult>({
		url: `/gptservice/auth/sendMsg`,
		method: "POST",
		data,
	});
}

interface IFetchGetPublicKeyResult {
	code: number;
	msg: string;
	data: string;
}
// 获取RSA加密公钥
export function fetchGetPublicKey() {
	return request<IFetchGetPublicKeyResult>({
		url: `/gptservice/auth/publicKey`,
		method: "GET",
	});
}

interface IFetchChatHistoryUploadParams {
	userId: number; // 用户id
	chatId?: number | string; // 聊天框id
	charFrom?: number; // 来源 0：AI，1：人
	charTime?: string; // 聊天时间
	model: string; // 模型
	charContent: string; // 内容
}

interface IFetchChatHistoryUploadResult {
	code: number;
	msg: string;
}
// 上传聊天记录
export function fetchChatHistoryUpload(params: IFetchChatHistoryUploadParams) {
	return request<IFetchChatHistoryUploadResult>({
		url: `/gptservice/chatHistory/add`,
		method: "GET",
		params,
	});
}

interface IFetchFileUploadParams {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	file: any;
	formDataRequest: boolean;
}

interface IFetchFileUploadResult {
	code: number;
	msg: string;
	data: {
		url: string;
	};
}

// 上传文件
export function fetchFileUpload(data: IFetchFileUploadParams) {
	return request<IFetchFileUploadResult>({
		url: `/gptservice/v1/file`,
		method: "POST",
		data,
	});
}

// v1/images/generations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fetchImageGenerations(data: any) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return request<any>({
		url: `/gptservice/v1/images/generations`,
		method: "POST",
		data,
	});
}

export interface IFetchModelListResult {
	code: number;
	msg: string;
	data: {
		records: {
			id?: string;
			modelName?: string; // 模型名称
			modelType?: string; // 所属类别
			modelPricingType?: string; // 模型定价类型
			modelPrice?: string; // 价格
			supplierName?: string; // 供应商
			supplierId?: string;
			description?: string; // 模型描述
			tokenLimit?: number; // token最大限制次数
			rpm?: number; // rpm
			status?: boolean; // 是否启用
			isDefault?: boolean;
			label?: string;
			value?: string;
		}[];
		total: number;
	};
}

interface IFetchModelListParams {
	pageNo: number;
	pageSize: number;
	supplierName?: string; // 供应商名称名称
}

// 获取模型列表
export function fetchModelList(params: IFetchModelListParams) {
	return request<IFetchModelListResult>({
		url: `/gptservice/model/page`,
		method: "GET",
		params,
	});
}
