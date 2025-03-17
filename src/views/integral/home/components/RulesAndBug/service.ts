import { message } from "@/hooks/useNaiveUIProvider";
import { useIntegralStore } from "@/store/modules/integral";

import {
	fetchBuyConfigList,
	fetchCdkeyExchange,
	fetchOrderBuy,
	fetchQrCodeCreate,
	fetchUserScoreSign,
} from "./api";
import type { Model } from "./model";

export default class Service {
	private model: Model;

	constructor(model: Model) {
		this.model = model;
	}

	//签到
	async onScoreSign() {
		try {
			this.model.scoreSignLoading.value = true;
			const res = await fetchUserScoreSign({
				userId: this.model.userInfo.value.id,
			});
			if (res.data) {
				message.success("签到成功");
				// 签到成功重新获取积分
				this.loadUserIntegtalInfo();
			} else {
				message.error("签到失败");
			}
		} finally {
			this.model.scoreSignLoading.value = false;
		}
	}

	// 获取积分详情
	loadUserIntegtalInfo() {
		const integralStore = useIntegralStore();
		integralStore.loadUserScoreDetail();
	}

	// 获取积分购买列表
	async loadBuyConfigList() {
		const res = await fetchBuyConfigList();
		if (res.data) {
			this.model.buyList.value = res.data.records;
		}
	}

	// cdkey 兑换
	async onCdkeyExchange() {
		try {
			this.model.cdkeySubmitLoading.value = true;
			const res = await fetchCdkeyExchange(this.model.userInfo.value.id || "");
			this.model.cdkey.value = "";
			message.error(res.data ? "兑换成功" : "兑换失败");
		} finally {
			this.model.cdkeySubmitLoading.value = false;
		}
	}

	async onBuy(type: string, scoreConfigId: number) {
		const res = await fetchOrderBuy({
			spuId: scoreConfigId,
			channelCode: type, // wx_native | alipay_pc
			returnUrl: `${window.location}`,
		});

		if (res.code === 0 && res?.data && res.data?.displayContent) {
			if (type === "alipay_pc") {
				// 支付宝直接跳转
				window.open(res.data?.displayContent);
			} else {
				// 微信展示二维码
				const res2 = await fetchQrCodeCreate({
					content: res.data?.displayContent,
					wide: 200,
					high: 200,
				});
				if (res2.data) {
					this.model.wechatPayQrCode.value = `data:image/png;base64,${res2.data.qrCode}`;
					this.model.qrcodeModalShow.value = true;
				}
			}
		}
	}
	// 初始化
	init() {
		this.loadUserIntegtalInfo();
		this.loadBuyConfigList();
	}
}
