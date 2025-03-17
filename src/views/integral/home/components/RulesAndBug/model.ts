import { computed, ref } from "vue";

import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useUserStore } from "@/store";

import type { IFetchBuyConfigListResult } from "./api";

export const useModel = () => {
	const userStore = useUserStore();
	const userInfo = computed(() => userStore.userInfo);

	const { isMobile } = useBasicLayout();

	// 购买列表
	const buyList = ref<IFetchBuyConfigListResult["data"]["records"]>([]);
	// 签到loading
	const scoreSignLoading = ref(false);

	const buyOptions = [
		{
			label: "微信",
			key: "wx_native",
		},
		{
			label: "支付宝",
			key: "alipay_pc",
		},
	];

	// 兑换码
	const cdkey = ref("");
	const cdkeySubmitLoading = ref(false);

	// 邀请链接
	const inviteLink = ref(
		`${window.location.origin}/#/register?inviteUserId=${
			userInfo.value.id || ""
		}`,
	);

	// 群二维码地址
	const groupAddress = ref([
		"https://black-pearl.oss-cn-shenzhen.aliyuncs.com/2024/04/01/c4e14d02-6b2a-43c2-8fd6-673ae6b5b9fa.jpg",
		"https://black-pearl.oss-cn-shenzhen.aliyuncs.com/2024/05/06/77989fb9-fcef-494e-b399-3e01a4d2ccd0.jpg",
	]);

	// 微信支付二维码
	const qrcodeModalShow = ref(false);
	const wechatPayQrCode = ref("");
	return {
		userInfo,
		scoreSignLoading,
		buyList,
		cdkey,
		inviteLink,
		groupAddress,
		cdkeySubmitLoading,
		isMobile,
		buyOptions,
		wechatPayQrCode,
		qrcodeModalShow,
	};
};

export type Model = ReturnType<typeof useModel>;
