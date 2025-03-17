<script setup lang="ts">
import { NInput } from "naive-ui";
import { ref, watch } from "vue";

import { SvgIcon } from "@/components/common";

import { homeStore } from "@/store";

import AiGptsCom from "./aiGptsCom.vue";

const qref = ref();
const st = ref({ showImg: false, q: "" });
watch(
	() => homeStore.myData.act,
	(n) => {
		if (n == "showgpts") st.value.showImg = true;
	},
);
const search = () => {
	if (!st.value.q) return;
	qref.value.searchQ(st.value.q);
};
const toq = (d: any) => {
	st.value.q = d.q;
};
</script>
<template>
	<div class="gpts-container">
		<div class="title-container dark:bg-black bg-white">
			<div class="title">
				<n-text>{{ $t("mjtab.GPTs") }}</n-text>
			</div>
			<div class="max-w-[400px]">
				<n-input
					round
					:placeholder="$t('mjchat.searchPlaceholder')"
					clearable
					v-model:value="st.q"
					@keydown.enter="search()"
				>
					<template #prefix>
						<SvgIcon icon="uil:search" />
					</template>
					<template #suffix>
						<div class="cursor-pointer" @click="search()">
							{{ $t("mjchat.search") }}
						</div>
					</template>
				</n-input>
			</div>
		</div>
		<AiGptsCom @close="st.showImg = false" ref="qref" :q="st.q" @toq="toq" />
		<n-back-top :right="20" :bottom="80" />
	</div>
</template>
<style scoped lang="less">
.gpts-container {
	padding: 20px 20px 0px 20px;
	.title-container {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 56px;
		display: flex;
		align-items: center;
		padding: 0px 20px;
		flex-direction: row;
		justify-content: space-between;
		z-index: 999;

		.title {
			font-weight: 600;
			font-size: 20px;
		}
	}
}
</style>
