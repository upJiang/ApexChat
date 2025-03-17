<script lang="ts" setup>
import { NModal } from "naive-ui";
import { computed, nextTick, ref } from "vue";

import { HoverButton, SvgIcon } from "@/components/common";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { gptConfigStore, homeStore, useAppStore, useChatStore } from "@/store";
import { useModelStore } from "@/store/modelStore";
import { useIntegralStore } from "@/store/modules/integral";
import aiModel from "@/views/mj/aiModel.vue";

const { isMobile } = useBasicLayout();

interface Props {
	usingContext?: boolean;
	onlyMenuShow?: boolean; // 仅展示菜单
	showIntergtal?: boolean; // 展示积分
}

interface Emit {
	(ev: "export"): void;
	(ev: "handleClear"): void;
}

defineProps<Props>();

const emit = defineEmits<Emit>();

const appStore = useAppStore();
const chatStore = useChatStore();

const collapsed = computed(() => appStore.siderCollapsed);
const currentChatHistory = computed(
	() => chatStore.getChatHistoryByCurrentActive,
);

function handleUpdateCollapsed() {
	appStore.setSiderCollapsed(!collapsed.value);
}

function onScrollToTop() {
	const scrollRef = document.querySelector("#scrollRef");
	if (scrollRef) nextTick(() => (scrollRef.scrollTop = 0));
}

function handleExport() {
	emit("export");
}

function handleClear() {
	emit("handleClear");
}

const st = ref({ isShow: false });

// 积分
const integralInfo = computed(() => useIntegralStore());
</script>

<template>
	<header
		v-if="onlyMenuShow"
		class="sticky top-0 left-0 right-0 z-30 border-b dark:border-neutral-800 bg-white/80 dark:bg-black/20 backdrop-blur"
	>
		<div
			class="relative flex items-center justify-between min-w-0 overflow-hidden h-14"
		>
			<div class="flex items-center">
				<button
					class="flex items-center justify-center w-11 h-11"
					@click="handleUpdateCollapsed"
					v-if="isMobile"
				>
					<SvgIcon v-if="collapsed" class="text-2xl" icon="ri:align-justify" />
					<SvgIcon v-else class="text-2xl" icon="ri:align-right" />
				</button>
				<span
					v-if="showIntergtal"
					class="font-bold"
					style="font-size: 15px; margin-top: 4px"
				>
					我的积分: {{ integralInfo.userIntegralInfo?.score || 0 }}
				</span>
			</div>
		</div>
	</header>
	<header
		v-else
		class="sticky top-0 left-0 right-0 z-30 border-b dark:border-neutral-800 bg-white/80 dark:bg-black/20 backdrop-blur"
	>
		<div
			class="relative flex items-center justify-between min-w-0 overflow-hidden h-14"
		>
			<div class="flex items-center">
				<button
					class="flex items-center justify-center w-11 h-11"
					@click="handleUpdateCollapsed"
					v-if="isMobile"
				>
					<SvgIcon v-if="collapsed" class="text-2xl" icon="ri:align-justify" />
					<SvgIcon v-else class="text-2xl" icon="ri:align-right" />
				</button>
			</div>
			<h1
				class="flex-1 px-4 pr-6 overflow-hidden cursor-pointer select-none text-ellipsis whitespace-nowrap"
				@dblclick="onScrollToTop"
			>
				{{ currentChatHistory?.title ?? "" }}
			</h1>
			<div class="flex items-center space-x-2">
				<HoverButton @click="handleExport">
					<span class="text-xl text-[#4f555e] dark:text-white">
						<SvgIcon icon="ri:download-2-line" />
					</span>
				</HoverButton>
				<HoverButton @click="handleClear">
					<span class="text-xl text-[#4f555e] dark:text-white">
						<SvgIcon icon="ri:delete-bin-line" />
					</span>
				</HoverButton>
			</div>
		</div>

		<div
			@click="st.isShow = true"
			style="width: max-content"
			class="absolute left-1/2 top-full -translate-x-1/2 cursor-pointer select-none rounded-b-md border bg-white px-2 dark:border-neutral-800 dark:bg-[#111114]"
		>
			<div
				class="flex items-center justify-center space-x-1 cursor-pointer hover:text-[#4b9e5f]"
				v-if="homeStore.myData.local != 'draw'"
			>
				<template v-if="gptConfigStore.myData.gpts">
					<SvgIcon icon="ri:apps-fill" />
					<span class="line-clamp-1 overflow-hidden">
						{{ gptConfigStore.myData.gpts.name }}
					</span>
				</template>
				<template v-else>
					<SvgIcon icon="heroicons:sparkles" />
					<span>
						{{
							useModelStore().modelList.find(
								(item) => item.value === gptConfigStore.myData.model,
							)?.label
						}}
					</span>
				</template>
				<SvgIcon icon="icon-park-outline:right" />
			</div>
		</div>
	</header>

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
</template>
