<script setup lang="ts">
import { NLayout, NLayoutContent, useMessage } from "naive-ui";
import { computed } from "vue";
import { useRoute } from "vue-router";

import { openaiSetting } from "@/api";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { t } from "@/locales";
import { gptConfigStore, homeStore, useAppStore } from "@/store";
import { isObject } from "@/utils/is";
import { aiFooter, aiSider } from "@/views/mj";
import aiMobileMenu from "@/views/mj/aiMobileMenu.vue";

import Sider from "./sider/index.vue";

const appStore = useAppStore();

const rt = useRoute();
const ms = useMessage();
openaiSetting(rt.query);
if (rt.name === "GPTs") {
	let model = `gpt-4-gizmo-${rt.params.gid.toString()}`;
	gptConfigStore.setMyData({ model: model });
	ms.success(`GPTs ${t("mj.modleSuccess")}`);
} else if (rt.name === "Setting") {
	openaiSetting(rt.query);
	if (isObject(rt.query)) ms.success(t("mj.setingSuccess"));
} else if (rt.name === "Model") {
	let model = `${rt.params.gid.toString()}`;
	gptConfigStore.setMyData({ model: model });
	ms.success(t("mj.modleSuccess"));
}

homeStore.setMyData({ local: "Chat" });
const { isMobile } = useBasicLayout();

const collapsed = computed(() => appStore.siderCollapsed);

const getMobileClass = computed(() => {
	if (isMobile.value) return ["rounded-none", "shadow-none"];
	return ["shadow-md", "dark:border-neutral-800"]; //'border', 'rounded-md',
});

const getContainerClass = computed(() => {
	return ["h-full", { abc: !isMobile.value && !collapsed.value }];
});
</script>

<template>
	<div
		class="dark:bg-[#24272e] transition-all p-0"
		:class="[isMobile ? 'h55' : 'h-full']"
	>
		<div class="h-full overflow-hidden" :class="getMobileClass">
			<NLayout class="z-40 transition" :class="getContainerClass" has-sider>
				<aiSider v-if="!isMobile" />
				<Sider />
				<NLayoutContent class="h-full">
					<RouterView v-slot="{ Component, route }">
						<component :is="Component" :key="route.fullPath" />
					</RouterView>
				</NLayoutContent>
			</NLayout>
		</div>
	</div>
	<aiMobileMenu v-if="isMobile" />

	<aiFooter />
</template>

<style>
.h55 {
	height: calc(100% - 55px);
}
</style>
