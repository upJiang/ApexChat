import { useMessage } from "naive-ui";

import { useModel } from "./model";
import Service from "./service";

export const usePresenter = () => {
	const model = useModel();
	const service = new Service(model);

	const message = useMessage();

	// 签到
	const handleOnScoreSign = async () => {
		await service.onScoreSign();
	};

	// 选择支付方式
	const handleSelectBuyType = async (type: string, scoreConfigId: number) => {
		await service.onBuy(type, scoreConfigId);
	};

	// 兑换码兑换提交
	const handleCdkeySubmit = async () => {
		if (!model.cdkey.value.trim()) {
			message.error("请输入兑换码");
			return;
		}
		await service.onCdkeyExchange();
	};

	// 复制邀请链接
	const handleInviteLinkCopy = async () => {
		await navigator.clipboard.writeText(model.inviteLink.value);
		message.success("复制成功");
	};

	service.init();
	return {
		model,
		service,
		handleOnScoreSign,
		handleCdkeySubmit,
		handleInviteLinkCopy,
		handleSelectBuyType,
	};
};
