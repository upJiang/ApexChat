import { reactive } from "vue";

import { gptsType } from "@/api";
import { useModelStore } from "@/store/modelStore";

export const homeStore = reactive({
	myData: {
		// updateTask 更新任务，重新加载页面
		// updateChat 更新聊天记录
		//  stopLoading 停止加载动画
		// draw 绘画 触发gpt提交
		// scrollToBottom，scrollToBottomIfAtBottom 滚动到底部
		// gpt.submit，gpt.resubmit， gpt提交
		// playtts 开始录音 ，gpt.ttsv2（文本转语音）
		// abort 中止输出
		// mjReload mj重新加载
		// dallReload dall重新加载
		// showgpts 打开gpts
		act: "", //动作,
		actData: {}, //动作类别
		local: "", //当前所处的版本
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		session: {} as any,
		isLoader: false,
		showDrawDrawer: false, // 是否弹出绘画抽屉，仅移动端
		requestError: 0, // 当监听这个变化时则表示请求失败
	},

	setMyData(v: object) {
		this.myData = { ...this.myData, ...v };
		if (Object.keys(v).indexOf("act") > -1) {
			setTimeout(() => {
				this.myData.act = "";
				this.myData.actData = "";
			}, 2000);
		}
	},
});

export interface gptConfigType {
	model?: string;
	max_tokens: number;
	userModel?: string; //自定义
	talkCount: number; //联系对话
	systemMessage: string; //自定义系统提示语
	gpts?: gptsType;
	uuid?: number;
	rpm?: number;
	gptsType?: string;
}
const getGptInt = (): gptConfigType => {
	let v: gptConfigType = getDefault();
	const str = localStorage.getItem("gptConfigStore");
	if (str) {
		const old = JSON.parse(str);
		if (old) v = { ...v, ...old };
	}
	const newV = {
		...v,
		model: v.model || useModelStore().defaultModel,
	};
	return newV;
};

const getDefault = () => {
	const amodel =
		homeStore.myData.session.amodel ?? useModelStore().defaultModel;

	const v: gptConfigType = {
		model: amodel,
		max_tokens: 1024,
		userModel: "",
		talkCount: 10,
		systemMessage: "",
	};
	return v;
};
export const gptConfigStore = reactive({
	myData: getGptInt(),
	setMyData(v: Partial<gptConfigType>) {
		this.myData = { ...this.myData, ...v };
		//mlog('gptConfigStore', v )
		if (v.model && !v.gpts) this.myData.gpts = undefined;

		if (!this.myData.model) {
			this.myData.model = useModelStore().defaultModel;
		}
		localStorage.setItem("gptConfigStore", JSON.stringify(this.myData));
	},
	setInit() {
		this.setMyData(getDefault());
	},
});

export interface gptServerType {
	OPENAI_API_KEY: string;
	OPENAI_API_BASE_URL: string;
	MJ_SERVER: string;
	MJ_API_SECRET: string;
	UPLOADER_URL: string;
	MJ_CDN_WSRV?: boolean; //wsrv.nl
}

const getServerDefault = () => {
	const v: gptServerType = {
		OPENAI_API_KEY: "",
		OPENAI_API_BASE_URL: "",
		MJ_SERVER: "",
		UPLOADER_URL: "",
		MJ_API_SECRET: "",
		MJ_CDN_WSRV: false,
	};
	return v;
};
const getServerInit = (): gptServerType => {
	let v: gptServerType = getServerDefault();
	const str = localStorage.getItem("gptServerStore");
	if (str) {
		const old = JSON.parse(str);
		if (old) v = { ...v, ...old };
	}

	return v;
};

export const gptServerStore = reactive({
	myData: getServerInit(),
	setMyData(v: Partial<gptServerType>) {
		this.myData = { ...this.myData, ...v };
		localStorage.setItem("gptServerStore", JSON.stringify(this.myData));
	},
	setInit() {
		this.setMyData(getServerDefault());
	},
});
