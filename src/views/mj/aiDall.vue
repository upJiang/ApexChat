<script setup lang="ts">
import { NButton, NInput, NSelect } from "naive-ui";
import { computed, ref, watch } from "vue";
import { checkLoginShow } from "@/hooks/useShowLogin";
// import { gptFetch, mlog, upImg } from "@/api";
import { SvgIcon } from "@/components/common";
import { homeStore } from "@/store";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { gptConfigStore } from "@/store";
import { useModelStore } from "@/store/modelStore";
// const ms = useMessage();

const drawModelList = computed(() => {
	return [
		{
			label: "ApexDraw基础版",
			value:
				useModelStore().modelList.find(
					(item) => item.modelType === "ApexDraw基础版" && item.status,
				)?.modelName || "dall-e-2",
		},
		{
			label: "ApexDraw高级版",
			value:
				useModelStore().modelList.find(
					(item) => item.modelType === "ApexDraw高级版" && item.status,
				)?.modelName || "dall-e-3",
		},
	];
});
const st = ref({ isGo: false });
const f = ref({
	size: "1024x1024",
	prompt: "",
	model: drawModelList.value[0].value,
	n: 1,
});
watch(
	() => useModelStore().modelList,
	() => {
		f.value.model = drawModelList.value[0].value;
	},
);
const isDisabled = computed(() => {
	if (st.value.isGo || f.value.prompt.trim() === "") return true;
	return false;
});
const create = () => {
	if (!checkLoginShow()) return;
	if (f.value.model === "stable-diffusion") {
		const sdModel = useModelStore().modelList.find(
			(item) => item.value === "stable-diffusion",
		);
		gptConfigStore.setMyData({ model: "stable-diffusion" });
		homeStore.setMyData({
			act: "gpt.submit",
			actData: {
				...sdModel,
				prompt: f.value.prompt,
			},
			showDrawDrawer: false,
		});
		st.value.isGo = true;
		return;
	}
	let obj = {
		action: "gpt.dall-e-3",
		data: f.value,
	};
	homeStore.setMyData({ act: "draw", actData: obj, showDrawDrawer: false });
	st.value.isGo = true;
};
watch(
	() => homeStore.myData.act,
	(n) => {
		if (n === "dallReload") {
			st.value.isGo = false;
			f.value.prompt = "";
		}
		if (n === "updateChat") {
			st.value.isGo = false;
		}
	},
);

// 请求失败
watch(
	() => homeStore.myData.requestError,
	() => {
		console.log("监听失败");

		st.value.isGo = false;
	},
	{
		deep: true,
	},
);

const dimensionsList = computed(() => {
	if (f.value.model === "dall-e-2") {
		return [
			{
				label: "1024px*1024px",
				value: "1024x1024",
			},
			{
				label: "512px*512px",
				value: "512x512",
			},
			{
				label: "256px*256px",
				value: "256x256",
			},
		];
	}
	return [
		{
			label: "1024px*1024px",
			value: "1024x1024",
		},
		{
			label: "1792px*1024px",
			value: "1792x1024",
		},
		{
			label: "1024px*1792px",
			value: "1024x1792",
		},
	];
});
watch(
	() => f.value.model,
	() => {
		f.value.size = "1024x1024";
	},
);
const { isMobile } = useBasicLayout();
const showMargin = ref(false);

window.addEventListener("resize", () => {
	const currentHeight = window.innerHeight;
	const windowHeight = window.innerHeight;
	if (windowHeight > currentHeight) {
		showMargin.value = true;
	} else {
		showMargin.value = false;
	}
});
</script>
<template>
	<div style="height: 200px" v-if="showMargin && isMobile"></div>
	<section class="mb-4 flex justify-between items-center">
		<div>{{ $t("mjchat.version") }}</div>
		<n-select
			v-model:value="f.model"
			:options="drawModelList"
			size="small"
			class="!w-[70%]"
			:clearable="false"
		/>
	</section>
	<section class="mb-4 flex justify-between items-center">
		<div>{{ $t("mjchat.size") }}</div>
		<n-select
			v-model:value="f.size"
			:options="dimensionsList"
			size="small"
			class="!w-[70%]"
			:clearable="false"
		/>
	</section>
	<div class="mb-1">
		<n-input
			type="textarea"
			v-model:value="f.prompt"
			:placeholder="$t('mjchat.prompt')"
			round
			clearable
			maxlength="500"
			show-count
			:autosize="{ minRows: 3, maxRows: 10 }"
		/>
	</div>

	<div class="mb-4 flex justify-end items-center">
		<div class="flex">
			<n-button
				type="primary"
				:block="true"
				:disabled="isDisabled"
				@click="create()"
			>
				<SvgIcon icon="mingcute:send-plane-fill" />
				生成图片
			</n-button>
		</div>
	</div>

	<ul class="pt-4" v-html="$t('mjchat.dalleInfo')"></ul>
</template>
