<script setup lang="ts">
import { mlog } from "@/api";
//import { useAppStore, useChatStore } from '@/store';

import chatIndex from "@/views/chat/index.vue";

import aiSiderInput from "./aiSiderInput.vue";

// const appStore = useAppStore()
// const chatStore = useChatStore()
const drawSent = (obj: any) => {
	mlog("drawSent", obj);
};
const mjClose = () => {};

// function handleAdd() {
//   chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
//   if (isMobile.value)
//     appStore.setSiderCollapsed(true)
// }

//handleAdd();
</script>
<template>
	<!-- <chatIndex></chatIndex> -->

	<div class="flex h-full">
		<div class="h-full">
			<aiSiderInput
				@close="mjClose"
				@draw-sent="drawSent"
				:button-disabled="false"
			/>
		</div>

		<main class="flex-1 overflow-hidden h-full">
			<chatIndex />
		</main>
	</div>
</template>
