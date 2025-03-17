<template>
	<!-- 语音音阶动画 长按说话时的动画 -->
	<div class="mic-in-record-container" v-if="micState.inRecord">
		<section class="dots-container">
			<view class="dot" />
			<view class="dot" />
			<view class="dot" />
			<view class="dot" />
			<view class="dot" />
		</section>
		<span class="text">录音中...</span>
	</div>

	<div v-if="st.showMic" class="myinputs flex justify-center items-center">
		<AiMic @cancel="st.showMic = false" @send="sendMic" />
	</div>

	<div class="myinputs" v-else>
		<!-- 文件上传 -->
		<input
			type="file"
			id="fileInput"
			@change="selectFile"
			class="hidden"
			ref="fsRef"
			:accept="acceptData"
		/>
		<div class="w-full relative">
			<div
				class="flex items-base justify-start pb-1 flex-wrap-reverse"
				v-if="st.fileBase64.length > 0"
			>
				<div
					class="w-[60px] h-[60px] rounded-sm bg-slate-50 mr-1 mt-1 text-red-300 relative group"
					v-for="(v, ii) in st.fileBase64"
				>
					<NImage :src="v" object-fit="cover" class="w-full h-full">
						<template #placeholder>
							<a
								class="w-full h-full flex items-center justify-center text-neutral-500"
								:href="v"
								target="_blank"
							>
								<SvgIcon icon="mdi:download" />
								{{ $t("mj.attr1") }} {{ ii + 1 }}
							</a>
						</template>
					</NImage>
					<SvgIcon
						icon="mdi:close"
						class="hidden group-hover:block absolute top-[-5px] right-[-5px] rounded-full bg-red-300 text-white cursor-pointer"
						@click="st.fileBase64.splice(st.fileBase64.indexOf(v), 1)"
					/>
				</div>
			</div>
			<div class="absolute bottom-0 right-0 z-1">
				<NTag type="info" round size="small" :bordered="false">
					<div class="opacity-60 flex">
						<SvgIcon icon="material-symbols:token-outline" />
						剩余积分：{{ integralInfo.userIntegralInfo?.score || 0 }}
					</div>
				</NTag>
				<!-- <NPopover trigger="hover">
					<template #trigger>
						
					</template>
					<div class="w-[300px]">
						{{ $t("mj.tokenInfo1") }}
						<p class="py-1" v-text="$t('mj.tokenInfo2')"></p>
						<p class="text-right">
							<NButton @click="st.isShow = true" type="info" size="small">
								{{ $t("setting.setting") }}
							</NButton>
						</p>
					</div>
				</NPopover> -->
			</div>
		</div>

		<div
			class="input-oprate-container dark:bg-[#212729]"
			:style="
				inBlur ? 'border: #4b9e5f  1px solid;' : 'border: #e5e7eb 1px solid;'
			"
		>
			<div class="left-oprate dark:bg-[#383D3F]">
				<SvgIcon
					icon="line-md:uploading-loop"
					class="cursor-pointer oprate-img"
					v-if="st.isLoad == 1"
				/>
				<!-- 点击上传 -->
				<SvgIcon
					icon="ri:attachment-line"
					class="cursor-pointer oprate-img"
					@click="fsRef.click()"
					v-else
				/>
				<!-- <n-tooltip trigger="hover">
					<template #trigger>
						<SvgIcon
							icon="line-md:uploading-loop"
							class="cursor-pointer oprate-img"
							v-if="st.isLoad == 1"
						/>
						
							icon="ri:attachment-line"
							class="cursor-pointer oprate-img"
							@click="fsRef.click()"
							v-else
						/>
					</template>
					<div
						v-if="canVisionModel(gptConfigStore.myData.model)"
						v-html="$t('mj.upPdf')"
					></div>
					<div v-else v-html="$t('mj.upImg')"></div>
				</n-tooltip> -->
			</div>
			<!-- <div class="left-oprate" v-if="isMobile">
				<SvgIcon
					:icon="micState.isInRecordStatus ? 'bi:mic-mute' : 'bi:mic'"
					class="cursor-pointer oprate-img mic"
					@click="handelMicStart"
				/>
			</div> -->
			<div
				v-if="micState.isInRecordStatus"
				class="long-press-container"
				@touchstart="handleMouseDown"
				@touchend="handleStopRecord"
				@touchmove="handleStopRecord"
				@touchcancel="handleStopRecord"
			>
				{{ micState.inRecord ? "松开发送" : "长按说话" }}
			</div>
			<NAutoComplete
				v-if="!micState.isInRecordStatus"
				v-model:value="mvalue"
				:options="searchOptions"
				:render-label="renderOption"
			>
				<template #default="{ handleInput }">
					<NInput
						@drop="drop"
						@paste="paste"
						ref="inputRef"
						v-model:value="mvalue"
						type="textarea"
						:placeholder="placeholder"
						:autosize="{ minRows: 1, maxRows: 1 }"
						@input="handleInput"
						@focus="inBlur = true"
						@blur="inBlur = false"
						@keypress="handleEnter"
					></NInput>
				</template>
			</NAutoComplete>
			<div class="right-oprate">
				<NButton
					type="primary"
					:disabled="disabled || homeStore.myData.isLoader"
					@click="handleSubmit"
				>
					<template #icon>
						<span class="dark:text-black">
							<SvgIcon
								icon="ri:stop-circle-line"
								v-if="homeStore.myData.isLoader"
							/>
							<SvgIcon icon="ri:send-plane-fill" v-else />
						</span>
					</template>
				</NButton>
			</div>
		</div>
		<div class="bottom-tips">
			内容由 AI 大模型生成，请仔细甄别，
			<a
				href="https://beian.miit.gov.cn/"
				target="_blank"
				class="dark:text-white"
			>
				湘ICP备2024057126号
			</a>
		</div>
		<!-- translate-y-[-8px]       -->
	</div>

	<NModal
		v-model:show="st.isShow"
		preset="card"
		:title="$t('mjchat.modelChange')"
		class="!max-w-[500px]"
		@close="st.isShow = false"
		style="width: 90%; max-width: 500px"
	>
		<aiModel @close="st.isShow = false" :visible="st.isShow" />
	</NModal>

	<!-- <n-drawer v-model:show="st.showMic" :width="420" :on-update:show="onShowFun">
    <n-drawer-content title="录音" closable>
        <AiMic />
    </n-drawer-content>
</n-drawer> -->
</template>

<script setup lang="ts">
import {
	NAutoComplete,
	NButton,
	NImage,
	NInput,
	NModal,
	NPopover,
	NTag,
	useMessage,
} from "naive-ui";
import { RenderLabel } from "naive-ui/es/_internal/select-menu/src/interface";
import { AutoCompleteOptions } from "naive-ui/es/auto-complete/src/interface";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { checkDisableGpt4, getFileFromClipboard, isFileMp3, mlog } from "@/api";
import { fetchFileUpload } from "@/api/common";
import { SvgIcon } from "@/components/common";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { t } from "@/locales";
import { gptConfigStore, homeStore, useChatStore } from "@/store";
import aiModel from "@/views/mj/aiModel.vue";
import { checkLoginShow } from "@/hooks/useShowLogin";
import { SpeechRecognizer } from "@/utils/tencentcloud/app/speechrecognizer";
import AiMic from "./aiMic.vue";
import { reactive } from "vue";
import { useModelStore } from "@/store/modelStore";
import WebRecorder from "@/utils/tencentcloud/app/webrecorder";
import { useIntegralStore } from "@/store/modules/integral";

const longPressTimer: NodeJS.Timeout | undefined = undefined;
let isLongPress = false;
//import FormData from 'form-data'
const route = useRoute();
const chatStore = useChatStore();

// 积分
const integralInfo = computed(() => useIntegralStore());

const emit = defineEmits(["update:modelValue"]);
const props = defineProps<{
	modelValue: string;
	disabled?: boolean;
	searchOptions?: AutoCompleteOptions;
	renderOption?: RenderLabel;
}>();
const fsRef = ref();
const st = ref<{
	fileBase64: string[];
	isLoad: number;
	isShow: boolean;
	showMic: boolean;
}>({ fileBase64: [], isLoad: 0, isShow: false, showMic: false });
const { isMobile } = useBasicLayout();
const placeholder = computed(() => {
	if (isMobile.value) return t("chat.placeholderMobile");
	return t("chat.placeholder"); //可输入说点什么，也可贴截图或拖拽文件
});

const { uuid } = route.params as { uuid: string };

const handleSubmit = () => {
	if (!checkLoginShow()) return;
	if (mvalue.value == "") return;
	if (checkDisableGpt4(gptConfigStore.myData.model)) {
		ms.error(t("mj.disableGpt4"));
		return false;
	}
	if (homeStore.myData.isLoader) {
		return;
	}

	// 如果提交的是dall
	if (gptConfigStore.myData.model === "dall-e-3") {
		const obj = {
			action: "gpt.dall-e-3",
			data: {
				size: "1024x1024",
				prompt: mvalue.value,
				model: "dall-e-3",
				n: 1,
			},
		};
		homeStore.setMyData({ act: "draw", actData: obj, showDrawDrawer: false });
		mvalue.value = "";
		st.value.fileBase64 = [];
		return;
	}
	let obj = {
		prompt: mvalue.value,
		fileBase64: st.value.fileBase64,
	};
	homeStore.setMyData({
		act: "gpt.submit",
		actData: obj,
		showDrawDrawer: false,
	});
	mvalue.value = "";
	st.value.fileBase64 = [];
	return false;
};
const ms = useMessage();
const mvalue = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});
const selectFile = async (input: any) => {
	const file = input.target.files[0];
	// 调用 god
	upFile(file);
};

const upFile = async (file: any) => {
	console.log("upFilefile", file);
	// 对于mp3 文件使用腾讯云的语音识别转换
	if (isFileMp3(file.name)) {
		const query = {
			engine_type: "16k_zh",
			voice_format: file.name.split(".")[1] || "mp3",
			secretkey: import.meta.env.VITE_TENCENT_SECRET_KEY,
			secretid: import.meta.env.VITE_TENCENT_SECRET_ID,
			appid: import.meta.env.VITE_TENCENT_APP_ID,
		};
		const asrReq = new FlashRecognizer(query);
		asrReq.recognize(file, (error, _response, data) => {
			if (error) {
				console.log(error);
				return;
			}
			if (data) {
				ms.success("语音文件识别成功");
				gptConfigStore.setMyData({ model: useModelStore().defaultModel });
				homeStore.setMyData({
					act: "gpt.submit",
					actData: {
						prompt: data,
					},
					showDrawDrawer: false,
				});
			}
		});
	} else {
		const res = await fetchFileUpload({
			file,
			formDataRequest: true,
		});
		if (res?.data) {
			st.value.isLoad = 0;
			res?.data?.url && st.value.fileBase64.push(res?.data?.url);
		} else {
			st.value.isLoad = 0;
		}
	}
};

function handleEnter(event: KeyboardEvent) {
	if (!isMobile.value) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	} else {
		if (event.key === "Enter" && event.ctrlKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
}

const acceptData = computed(() => {
	return "image/jpeg, image/jpg, image/png, image/gif, .mp3, .mp4, .mpeg, .mpga, .m4a, .wav, .webm";
});

const sendMic = (e: any) => {
	mlog("sendMic", e);
	st.value.showMic = false;
	let du = "whisper.wav"; // (e.stat && e.stat.duration)?(e.stat.duration.toFixed(2)+'s'):'whisper.wav';
	const file = new File([e.blob], du, { type: "audio/wav" });
	homeStore.setMyData({
		act: "gpt.whisper",
		actData: { file, prompt: "whisper", duration: e.stat?.duration },
	});
};

const drop = (e: DragEvent) => {
	e.preventDefault();
	e.stopPropagation();
	if (!e.dataTransfer || e.dataTransfer.files.length == 0) return;
	const files = e.dataTransfer.files;
	upFile(files[0]);
	//mlog('drop', files);
};
const paste = (e: ClipboardEvent) => {
	let rz = getFileFromClipboard(e);
	if (rz.length > 0) upFile(rz[0]);
};

// 初始化腾讯云语音服务

// 点击录音
const handelMicStart = () => {
	micState.isInRecordStatus = !micState.isInRecordStatus;
	micState.inRecord = false;
};

// 录音对象
const micState = reactive({
	isInRecordStatus: false, // / 是否在录音状态
	inRecord: false, // 是否正在录音，只有长按的时候是
});

let recorder: { stop: () => any };
let speechRecognizer: SpeechRecognizer | null;
let isCanSendData = false;
let isCanStop: boolean;

const startRecord = () => {
	const query = {
		// 用户参数
		secretkey: import.meta.env.VITE_TENCENT_SECRET_KEY,
		secretid: import.meta.env.VITE_TENCENT_SECRET_ID,
		appid: import.meta.env.VITE_TENCENT_APP_ID,
		// 实时识别接口参数
		engine_model_type: "16k_zh", // 引擎
		voice_format: 1,
		// 以下为非必填参数，可跟据业务自行修改
		hotword_id: "08003a00000000000000000000000000",
		needvad: 1,
		filter_dirty: 1,
		filter_modal: 1,
		filter_punc: 1,
		convert_num_mode: 1,
		word_info: 2,
	};
	speechRecognizer = null;
	isCanSendData = false;

	const recorder = new WebRecorder();
	recorder.OnReceivedData = (res) => {
		// console.log(res) // res 为采集到浏览器数据
		if (isCanSendData && speechRecognizer) {
			// 发送数据
			speechRecognizer.write(res);
		}
	};
	// 录音失败时
	recorder.OnError = (err) => {
		console.log(err);
		recorder.stop();
	};
	recorder.start();

	if (!speechRecognizer) {
		speechRecognizer = new SpeechRecognizer(query);
	}

	let recognizeResult = "";

	// 开始识别
	speechRecognizer.OnRecognitionStart = (res: any) => {
		console.log("开始识别", res);
		isCanSendData = true;
		isCanStop = true;
	};
	// 一句话开始
	speechRecognizer.OnSentenceBegin = (res: any) => {
		console.log("一句话开始", res);
	};
	// 识别变化时
	speechRecognizer.OnRecognitionResultChange = (res: any) => {
		console.log("识别变化时", res);
	};
	// 一句话结束
	speechRecognizer.OnSentenceEnd = (res: {
		result: { voice_text_str: string };
	}) => {
		console.log("一句话结束", res);
		if (res?.result?.voice_text_str) {
			recognizeResult = recognizeResult + res?.result?.voice_text_str;
		}
	};
	// 识别结束
	speechRecognizer.OnRecognitionComplete = (res: any) => {
		console.log("识别结束", res);
		isCanSendData = false;
		if (recognizeResult) {
			gptConfigStore.setMyData({ model: useModelStore().defaultModel });
			homeStore.setMyData({
				act: "gpt.submit",
				actData: {
					prompt: recognizeResult,
				},
				showDrawDrawer: false,
			});
		}
	};
	// 识别错误
	speechRecognizer.OnError = (res: any) => {
		console.log("识别失败", res);
		isCanSendData = false;
	};

	// 建立连接
	speechRecognizer.start();
};

const handleStartRecord = () => {
	micState.inRecord = true;
	micState.isInRecordStatus = true;
	startRecord();
};

// 开始录音
const handleMouseDown = () => {
	if (!micState.isInRecordStatus || micState.inRecord) return;
	isLongPress = true;
	setTimeout(() => {
		if (isLongPress) {
			handleStartRecord();
			micState.inRecord = true;
		}
	}, 1000);
};

// 结束录音
const handleStopRecord = () => {
	clearTimeout(longPressTimer);
	isLongPress = false;
	if (!micState.inRecord || !micState.isInRecordStatus) return;
	micState.inRecord = false;
	micState.isInRecordStatus = false;
	console.log("结束录音");
	recorder && recorder.stop();
	if (isCanStop) {
		speechRecognizer.stop();
	}
};

const inBlur = ref(false);
</script>
<style lang="less">
.myinputs .n-input .n-input-wrapper {
	@apply items-stretch;
}
.myinputs .n-input--disabled {
	background-color: #fff !important;
	border-color: #18a058;
}
.mic-in-record-container {
	position: fixed;
	bottom: 120px;
	width: 100%;
	height: 70px;
	.text {
		position: absolute;
		bottom: 2px;
		left: 43%;

		color: #fff;

		animation: puls 1.5s infinite ease-in-out;
	}
}

.dots-container {
	position: absolute;
	bottom: 0;
	left: calc(27.5%);

	display: flex;
	align-items: center;
	justify-content: center;

	width: 45%;
	height: 70px;

	background-color: #08a89c;
	border-radius: 12px;
	.dot {
		width: 16px;
		height: 16px;
		margin-right: 10px;

		background-color: #fff;
		border-radius: 10px;

		&:last-child {
			margin-right: 0;
		}

		&:nth-child(1) {
			animation-delay: -0.3s;
		}

		&:nth-child(2) {
			animation-delay: -0.1s;
		}

		&:nth-child(3) {
			animation-delay: 0.1s;
		}
	}
}

@keyframes pulse {
	0% {
		transform: scale(0.8);
		background-color: #fff;
		box-shadow: 0 0 0 0 rgba(8, 168, 156, 0.7);
	}

	50% {
		transform: scale(1.2);
		background-color: #fff;
		box-shadow: 0 0 0 10px rgba(178, 212, 252, 0);
	}

	100% {
		transform: scale(0.8);
		background-color: #fff;
		box-shadow: 0 0 0 0 rgba(8, 168, 156, 0.7);
	}
}

@keyframes puls {
	0% {
		transform: translateY(0);
	}

	50% {
		transform: translateY(-4px);
	}

	100% {
		transform: translateY(0);
	}
}

.input-oprate-container {
	-webkit-user-select: none; /* Safari */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* IE/Edge */
	user-select: none; /* 标准语法 */
	display: flex;
	flex-direction: row;
	align-items: center;
	border: #e5e7eb 1px solid;
	border-radius: 4px;
	height: 40px;
	.n-input__border,
	.n-input__state-border {
		display: none;
	}
	.long-press-container {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	.n-auto-complete {
		padding-left: -8px;
	}
	.left-oprate {
		padding-left: 10px;
		padding-right: 10px;
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		border-top-left-radius: 4px;
		border-bottom-left-radius: 4px;
		.oprate-img {
			width: 17px;
			height: 17px;

			&.mic {
				margin-left: -12px;
			}
		}
	}
}

.bottom-tips {
	width: 100%;
	text-align: center;
	color: rgb(180, 187, 196, 1);
	margin-top: 4px;

	font-size: 12px;
}
</style>
