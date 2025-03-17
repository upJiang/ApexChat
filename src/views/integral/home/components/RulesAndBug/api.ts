import { request } from "@/utils/newRequest";

interface IFetchUserScoreSignParams {
	userId: number; // 用户id
}

interface IFetchUserScoreSignResult {
	code: number;
	msg: string;
	data: boolean;
}

// 用户签到
export function fetchUserScoreSign(data: IFetchUserScoreSignParams) {
	return request<IFetchUserScoreSignResult>({
		url: `/gptservice/score/sign/add`,
		method: "POST",
		data,
	});
}

export interface IFetchUserScoreDetailResult {
	code: number;
	msg: string;
	data: {
		userName: string; // 用户名称
		userId: string; // 用户id
		score: number; // 当前积分
		scoreUseTotal: number; // 积分使用总数
		scoreUseNumber: number; // 积分使用次数
		scoreObtainTotal: number; // 积分获得总数
		scoreExpireTotal: number; // 积分失效总数
		scoreFreezeTotal: number; // 冻结积分
		scoreUseLastTime: string; //积分最后使用时间
		tpm: number; // 每分钟积分量
		rpm: number; // 每分钟请求量
		rqm: number; // 请求数量
	};
}

// 积分账户详情
export function fetchUserScoreDetail() {
	return request<IFetchUserScoreDetailResult>({
		url: `/gptservice/score/account/get`,
		method: "GET",
	});
}

interface IFetchScoreOrderCreateParams {
	scoreOrder: {
		amount: number;
	};
}

interface IFetchScoreOrderCreateResult {
	code: number;
	msg: string;
}

// 积分订单创建
export function fetchScoreOrderCreate(data: IFetchScoreOrderCreateParams) {
	return request<IFetchScoreOrderCreateResult>({
		url: `/gptservice/score/order/create`,
		method: "POST",
		data,
	});
}

export interface IFetchBuyConfigListResult {
	code: number;
	msg: string;
	data: {
		records: {
			scoreConfigId: number; // 积分配置主键id
			scoreConfigKey: number; // 积分配置key
			scoreConfigValue: number; // 积分配置value
			scoreConfigRate: number; // 积分赠送比率
			scoreConfigType: number; // 积分配置类型(1积分2余额)
			delFlag: number; // 删除标志（0代表存在 2代表删除）
		}[];
	};
}
// 获取积分购买列表
export function fetchBuyConfigList() {
	return request<IFetchBuyConfigListResult>({
		url: `/gptservice/score/config/list`,
		method: "GET",
	});
}

interface IFetchCdkeyExchangeResult {
	code: number;
	msg: string;
	data: boolean;
}
// cdkey 兑换
export function fetchCdkeyExchange(scoreSourceId: string | number) {
	return request<IFetchCdkeyExchangeResult>({
		url: `/gptservice/score/order/exchange`,
		method: "POST",
		data: {
			scoreSourceId,
		},
	});
}

interface IFetchOrderBuyParams {
	spuId: number;
	channelCode: string;
	returnUrl: string;
}
interface IFetchOrderBuyResult {
	code: number;
	msg: string;
	data: {
		status: number;
		displayContent: string;
	};
}
// cdkey 兑换
export function fetchOrderBuy(data: IFetchOrderBuyParams) {
	return request<IFetchOrderBuyResult>({
		url: `/gptservice/pay/order/createAndPay`,
		method: "POST",
		data,
	});
}

interface IFetchQrCodeCreateParams {
	content: string;
	wide: number;
	high: number;
}
interface IFetchQrCodeCreateResult {
	code: number;
	msg: string;
	data: {
		qrCode: string;
	};
}
// 生成二维码
export function fetchQrCodeCreate(data: IFetchQrCodeCreateParams) {
	return request<IFetchQrCodeCreateResult>({
		url: `/gptservice/qrCode/create`,
		method: "POST",
		data,
	});
}
