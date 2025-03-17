import dayjs from "dayjs";

import { router } from "@/router";
import { gptConfigStore, homeStore, useChatStore } from "@/store";

import { useModel } from "./model";
import Service from "./service";

export const usePresenter = () => {
	const model = useModel();
	const service = new Service(model);

	// 选择分类
	const handleOnSlectClassify = async (val: string) => {
		model.currentClassify.value = val;
		if (val === "收藏") {
			try {
				model.loading.value = true;
				// 拉取收藏的id
				await service.getCollectList();
				model.creativeList.value = model.creativeListTemp.value.filter((item) =>
					model.collectList.value.includes(item.id!),
				);
			} finally {
				model.loading.value = false;
			}
		} else {
			model.creativeList.value = model.creativeListTemp.value.filter((item) =>
				item.classify!.includes(val),
			);
		}
	};

	// 搜索
	const handleOnSearch = (val: string) => {
		if (!val) {
			model.creativeList.value = model.creativeListTemp.value;
			model.currentClassify.value = model.classifyList.value[0];
		} else {
			model.creativeList.value = model.creativeListTemp.value.filter((item) =>
				item.name!.includes(val),
			);
		}
	};

	const handleOnCreate = (record: (typeof model.creativeList.value)[0]) => {
		gptConfigStore.setMyData({
			...record.modelConfig,
			gpts: { name: record.name || "" },
			gptsType: "creative",
		});

		// 先判断是否存在改聊天记录
		const chatStore = useChatStore();
		let newUuid = 0;

		if (chatStore.history.find((item) => item.title === record.name)) {
			// 通过聊天名字去匹配，匹配不到则重新添加
			newUuid = chatStore.history.find(
				(item) => item.title === record.name,
			)!.uuid;
		} else {
			// 通过聊天名字去匹配，匹配不到则重新添加
			newUuid = chatStore.active ? Date.now() : 1002;
			chatStore.addHistory({
				title: record!.name!,
				uuid: newUuid,
				isEdit: false,
				isGpts: true,
				model: record!.modelConfig!.model!,
				modelName: record!.name!,
			});
		}

		// 清空过去聊天记录
		chatStore.clearChatByUuid(newUuid);
		chatStore.setActive(newUuid);

		record.context!.forEach((item) => {
			chatStore.addChatByUuid(newUuid, {
				model: record.modelConfig!.model,
				dateTime: dayjs().format("YYYY/MM/DD HH:mm:ss"),
				error: false,
				inversion: item.role === "system" ? false : true,
				requestOptions: {
					options: null,
					prompt: item?.content || "",
				},
				text: item?.content || "",
			});
		});

		router.replace({
			name: "Chat",
			params: { uuid: newUuid },
		});
		// 滚动到底部
		setTimeout(() => {
			homeStore.setMyData({ act: "scrollToBottom" });
		}, 500);
	};

	// 点击收藏
	const handleOnCollect = (
		e: { stopPropagation: () => void },
		record: (typeof model.creativeList.value)[0],
	) => {
		e.stopPropagation();
		// 调用接口
		service.onCollect(record.id!);
	};

	service.getList();
	return {
		model,
		service,
		handleOnSearch,
		handleOnCreate,
		handleOnCollect,
		handleOnSlectClassify,
	};
};
