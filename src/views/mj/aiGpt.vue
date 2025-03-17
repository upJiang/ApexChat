<script setup lang="ts">
//import { isNumber } from '@/utils/is'
import { useMessage } from "naive-ui";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import {
	canVisionModel,
	checkDisableGpt4,
	getHistoryMessage,
	getInitChat,
	getSystemMessage,
	localSaveAny,
	mlog,
	subModel,
} from "@/api";
import { t } from "@/locales";
import { gptConfigStore, homeStore, useChatStore } from "@/store";
import { useModelStore } from "@/store/modelStore";

import { useChat } from "../chat/hooks/useChat";

const emit = defineEmits(["finished"]);
const { addChat, updateChatSome } = useChat();
const chatStore = useChatStore();
const st = ref({ uuid: "1002", index: -1 });
const controller = ref<AbortController>(); // new AbortController();
const dataSources = computed(() => chatStore.getChatByUuid(+st.value.uuid));
const ms = useMessage();
const textRz = ref<string[]>([]);
const goFinish = () => {
	//let dindex = st.value.index>=0? st.value.index : dataSources.value.length - 1;
	//return ;
	updateChatSome(+st.value.uuid, st.value.index, {
		dateTime: new Date().toLocaleString(),
		loading: false,
	});
	//scrollToBottom();
	emit("finished");
	setTimeout(() => {
		homeStore.setMyData({ act: "scrollToBottom" });
	}, 500);
	homeStore.setMyData({ act: "scrollToBottomIfAtBottom" });
	mlog("🐞 goFinish2", st.value.uuid);
	// setTimeout(() => {

	//    if(textRz.value.length>0 )  textRz.value = [];
	// }, 200 );
};

const getMessage = async (start = 1000, loadingCnt = 3) => {
	return getHistoryMessage(dataSources.value, loadingCnt, start);
};
watch(
	() => textRz.value,
	(n) => {
		if (n && n.length && n[0].includes("积分不足")) {
			updateChatSome(+st.value.uuid, st.value.index, {
				dateTime: new Date().toLocaleString(),
				text: "抱歉，您的积分不足，请充值后重试",
			});
			return;
		}
		if (n && n.length && n[0].includes("失败原因")) {
			updateChatSome(+st.value.uuid, st.value.index, {
				dateTime: new Date().toLocaleString(),
				text: "抱歉，暂无结果，请重新输入",
			});
			return;
		}
		//mlog('🐞 textRz',n);
		if (n.length == 0) return;
		updateChatSome(+st.value.uuid, st.value.index, {
			dateTime: new Date().toLocaleString(),
			text: n.join(""),
		});
		//scrollToBottom();
		homeStore.setMyData({ act: "scrollToBottomIfAtBottom" });
		//homeStore.setMyData({act:'scrollToBottom'})
	},
	{ deep: true },
);
const { uuid } = useRoute().params as { uuid: string };
watch(
	() => homeStore.myData.act,
	async (n) => {
		if (n == "gpt.submit" || n == "gpt.whisper") {
			if (checkDisableGpt4(gptConfigStore.myData.model)) {
				ms.error(t("mj.disableGpt4"));
				return false;
			}
			const dd: any = homeStore.myData.actData;
			mlog("gpt.submit", dd, dd.uuid);
			let uuid2 = dd.uuid ?? uuid;
			st.value.uuid = uuid2;
			let model = gptConfigStore.myData.model;

			let promptMsg = getInitChat(dd.prompt);
			if (dd.fileBase64 && dd.fileBase64.length > 0) {
				if (!canVisionModel(model)) model = "gpt-4-vision-preview";

				try {
					let images = await localSaveAny(JSON.stringify(dd.fileBase64));
					mlog("key", images);
					promptMsg.opt = { images: [images] };
				} catch (e) {
					mlog("localSaveAny error", e);
				}
				addChat(+uuid2, promptMsg);
			} else {
				addChat(+uuid2, promptMsg);
				homeStore.setMyData({ act: "scrollToBottom" });
			}

			let outMsg: Chat.Chat = {
				dateTime: new Date().toLocaleString(),
				text: t("mj.thinking"), //'思考中...',
				loading: true,
				inversion: false,
				error: false,
				conversationOptions: null,
				requestOptions: { prompt: dd.prompt, options: {} },
				uuid: +uuid2,
				model,
				myid: `${Date.now()}`,
			};
			if (gptConfigStore.myData.gpts) {
				outMsg.logo = gptConfigStore.myData.gpts?.logo;
			}
			addChat(+uuid2, outMsg);
			st.value.index = dataSources.value.length - 1;
			if (textRz.value.length >= 0) textRz.value = [];

			homeStore.setMyData({ act: "scrollToBottom" });
			let historyMesg = await getMessage();
			mlog("historyMesg", historyMesg);
			//return ;
			let message = [
				{ role: "system", content: getSystemMessage(+uuid2) },
				...historyMesg,
			];
			if (dd.fileBase64 && dd.fileBase64.length > 0) {
				if (model == "gpt-4-vision-preview") {
					let obj = {
						role: "user",
						content: [] as any,
					};
					// //"Generate code for a web page that looks exactly like this."
					obj.content.push({ type: "text", text: dd.prompt });
					dd.fileBase64.forEach((f: any) => {
						obj.content.push({ type: "image_url", image_url: { url: f } });
					});
					message.push(obj);
				} else {
					let cc = dd.prompt;
					//附件需要时远程的图片链接 或者文件 链接
					let arr = dd.fileBase64.filter(
						(ff: string) => ff.indexOf("http") > -1,
					);
					if (arr.length > 0) cc = arr.join(" ") + " " + cc;
					message.push({ role: "user", content: cc });
				}
			} else {
				message.push({ role: "user", content: dd.prompt });
			}
			let opt = {};
			if (n == "gpt.whisper") {
				opt = {
					file: dd.file,
				};
			}
			submit(model, message, opt);
		} else if (n == "abort") {
			controller.value && controller.value.abort();
		} else if (n == "gpt.resubmit") {
			if (checkDisableGpt4(gptConfigStore.myData.model)) {
				ms.error(t("mj.disableGpt4"));
				return false;
			}
			const dd: any = homeStore.myData.actData;
			let uuid2 = dd.uuid ?? uuid;
			st.value.uuid = uuid2;
			st.value.index = +dd.index;

			mlog("gpt.resubmit", dd);
			let historyMesg = await getMessage(+dd.index - 1, 1); //
			mlog("gpt.resubmit historyMesg", historyMesg);
			let nobj = dataSources.value[dd.index];
			//mlog('gpt.resubmit model', nobj.model  );
			let model = nobj.model;
			if (!model) model = useModelStore().defaultModel;
			//return ;
			if (["whisper-1", "midjourney"].indexOf(model) > -1) {
				ms.error(t("mj.noSuppertModel"));
				return;
			}

			controller.value = new AbortController();
			let message = [
				{ role: "system", content: getSystemMessage() },
				...historyMesg,
			];
			textRz.value = [];
			submit(model, message);
		}
	},
);

const submit = (model: string, message: any[]) => {
	mlog("提交Model", model);
	controller.value = new AbortController();

	//controller.signal
	subModel({
		message,
		model,
		onMessage: (d) => {
			mlog("🐞消息", d);
			textRz.value.push(d.text);
			homeStore.setMyData({ act: "scrollToBottom" });
		},
		onError: (e: any) => {
			mlog("onError", e);
			let emsg = JSON.stringify(e.reason ? JSON.parse(e.reason) : e, null, 2);
			//if(emsg=='{}' ) emsg= JSON.stringify(e );

			if (e.message != "canceled" && emsg.indexOf("aborted") == -1)
				textRz.value.push(
					"\n" + t("mjchat.failReason") + "\n```\n" + emsg + "\n```\n",
				);
			goFinish();
		},
		signal: controller.value.signal,
	})
		.then(() => goFinish())
		.catch((e) => {
			if (e.message != "canceled")
				textRz.value.push(
					"\n" +
						t("mj.fail") +
						":\n```\n" +
						(e.reason ?? JSON.stringify(e, null, 2)) +
						"\n```\n",
				);
			goFinish();
		});
};

homeStore.setMyData({ isLoader: false });
</script>
<template></template>
