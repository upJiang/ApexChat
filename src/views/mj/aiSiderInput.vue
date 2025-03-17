<script setup lang="ts">
//import {  NLayoutSider } from 'naive-ui';
import { NDrawer, NDrawerContent } from "naive-ui";
import { computed, onMounted, ref, watch } from "vue";

import { useBasicLayout } from "@/hooks/useBasicLayout";
//import { SvgIcon } from '@/components/common';
import { homeStore } from "@/store";

import aiDrawInput from "./aiDrawInput.vue";

//import { homeStore } from '@/store';
const { isMobile } = useBasicLayout();

const pp = defineProps<{ buttonDisabled: boolean }>();
const handleUpdateCollapsed = (value: boolean) => {
	console.log(value);
};
const $emit = defineEmits(["drawSent", "close"]);
const isLoading = computed(() => {
	return pp.buttonDisabled;
});
function drawSent(e: any) {
	$emit("drawSent", e);
	homeStore.setMyData({ act: "draw", actData: e, showDrawDrawer: false });
}
// watch( ()=>homeStore.myData.act, (act) => {
//   act=='newtask' && (st.value.show=true);
//   act=='same2' && (st.value.show=true);
// });
</script>
<template>
	<div v-if="isMobile">
		<!-- <div class="fixed right-[30px] bottom-[70px] z-10">
    <n-button  type="warning" circle size="large" @click="st.show=true">
      <template #icon>
        <SvgIcon icon="ic:round-add"></SvgIcon>
      </template>
    </n-button>
    </div> -->
		<n-drawer
			v-model:show="homeStore.myData.showDrawDrawer"
			:height="565"
			placement="bottom"
		>
			<n-drawer-content style="--n-body-padding: 0" class="h-full">
				<aiDrawInput @draw-sent="drawSent" :button-disabled="isLoading" />
			</n-drawer-content>
		</n-drawer>
	</div>
	<section
		class="h-full overflow-auto w-[300px]"
		@update-collapsed="handleUpdateCollapsed"
		v-else
	>
		<!-- <div class="h-full w-full">
     <aiDrawInput class="p-4"/>
   </div> -->
		<div class="h-full w-full">
			<aiDrawInput @draw-sent="drawSent" :button-disabled="isLoading" />
		</div>
	</section>
</template>
