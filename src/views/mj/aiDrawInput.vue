<script setup lang="ts">
import { NTabPane, NTabs } from "naive-ui";

// import aiBlend from "./aiBlend.vue";
import aiDall from "./aiDall.vue";
// import aiDrawInputItem from "./aiDrawInputItem.vue";

const $emit = defineEmits(["drawSent", "close"]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const drawSent = (d: any) => $emit("drawSent", d);
</script>
<template>
	<div class="overflow-y-auto bg-[#fafbfc] pt-2 dark:bg-[#18181c] h-full">
		<n-tabs type="line" animated default-value="dall3">
			<n-tab-pane name="start" tab="" />
			<!-- <n-tab-pane name="draw" :tab="$t('mjchat.draw')">
				<aiDrawInputItem @draw-sent="drawSent" @close="$emit('close')" />
			</n-tab-pane>
			
			<n-tab-pane name="blend" :tab="$t('mjchat.blend')">
				<div class="p-4"><aiBlend /></div>
			</n-tab-pane> -->
			<n-tab-pane name="dall3" tab="ApexDraw">
				<div class="p-4"><aiDall /></div>
			</n-tab-pane>
		</n-tabs>
	</div>
</template>
