<template>
	<div
		class="bg-gray-100 dark:bg-[#282832] h-[55px] flex justify-around items-center dark:text-white/70"
	>
		<div
			class="flex items-center justify-center flex-col"
			@click="homeStore.setMyData({ act: 'showChat' })"
			:class="[goHome == 'Chat' ? 'active' : '']"
		>
			<SvgIcon icon="ri:wechat-line" class="text-3xl" />
			<div class="text-[13px]">{{ $t("mjtab.chat") }}</div>
		</div>
		<div
			class="flex items-center justify-center flex-col"
			@click="handleCreativeShow"
			:class="[goHome == 'creative' ? 'active' : '']"
		>
			<SvgIcon icon="icons8:create-new" class="text-3xl" />
			<div class="text-[13px]">创作</div>
		</div>
		<div
			class="flex items-center justify-center flex-col"
			@click="() => router.push({ path: '/gpts' })"
			:class="[goHome == 'gpts' ? 'active' : '']"
		>
			<SvgIcon icon="ri:apps-fill" class="text-3xl" />
			<div class="text-[13px]">{{ $t("mjtab.GPTs") }}</div>
		</div>

		<div
			class="flex items-center justify-center flex-col"
			@click="homeStore.setMyData({ act: 'showDraw' })"
			:class="[goHome == 'draw' ? 'active' : '']"
		>
			<SvgIcon icon="ic:outline-palette" class="text-3xl" />
			<div class="text-[13px]">{{ $t("mjtab.draw") }}</div>
		</div>
		<!-- <div
			class="flex items-center justify-center flex-col"
			@click="() => router.push({ path: '/gradio' })"
			:class="[goHome == 'gradio' ? 'active' : '']"
		>
			<SvgIcon icon="icons8:create-new" class="text-3xl" />
			<div class="text-[13px]">Gradio</div>
		</div> -->
		<!-- <div
			class="flex items-center justify-center flex-col"
			@click="homeStore.setMyData({ act: 'gallery' })"
		>
			<SvgIcon icon="material-symbols:imagesmode-outline" class="text-3xl" />
			<div class="text-[13px]">{{ $t("mjtab.gallery") }}</div>
		</div> -->
	</div>

	<n-drawer v-model:show="st.show" :height="650" placement="bottom">
		<n-drawer-content style="--n-body-padding: 0" class="h-full">
			<aiDrawInput @draw-sent="drawSent" />
		</n-drawer-content>
	</n-drawer>
</template>

<script setup lang="ts">
import { NDrawer, NDrawerContent } from "naive-ui";
import { computed, ref, watch } from "vue";

import { SvgIcon } from "@/components/common";
import { router } from "@/router";
import { homeStore, useChatStore } from "@/store";

import aiDrawInput from "./aiDrawInput.vue";

const chatStore = useChatStore();
const st = ref({ show: false });

const goHome = computed(() => {
	//router.push('/')
	return router.currentRoute.value.name;
});
function drawSent(e: any) {
	st.value.show = false;
	//$emit('drawSent', e)
	homeStore.setMyData({ act: "draw", actData: e });
}

watch(
	() => homeStore.myData.act,
	(n: string) => {
		if ("showChat" == n) {
			router.push("/chat/" + chatStore.active ?? "1002");
		}
		if ("showDraw" == n) {
			router.push("/draw/" + chatStore.active ?? "1002");
			setTimeout(() => {
				homeStore.setMyData({ showDrawDrawer: true });
			}, 10);
		}
	},
);

// 提示词商店弹窗

// 打开创作
const handleCreativeShow = () => {
	router.push("/creative");
};
</script>
