<script setup lang="ts">
import { NLayout, NLayoutContent } from "naive-ui";
import { computed } from "vue";
import { useRouter } from "vue-router";

import { useBasicLayout } from "@/hooks/useBasicLayout";
import { homeStore, useAppStore, useChatStore } from "@/store";
import { aiFooter, aiSider } from "@/views/mj";
import aiMobileMenu from "@/views/mj/aiMobileMenu.vue";

import Sider from "../chat/layout/sider/index.vue";

const router = useRouter();
const appStore = useAppStore();
const chatStore = useChatStore();

router.replace({ name: "draw", params: { uuid: chatStore.active } });
homeStore.setMyData({ local: "draw" });
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
			<NLayout
				class="z-40 transition"
				:class="getContainerClass"
				has-sider
				:sider-placement="isMobile ? 'left' : 'right'"
			>
				<aiSider v-if="!isMobile" />

				<NLayoutContent class="h-full">
					<RouterView v-slot="{ Component, route }">
						<component :is="Component" :key="route.fullPath" />
					</RouterView>
				</NLayoutContent>
				<Sider />
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
