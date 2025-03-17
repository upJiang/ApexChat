<template>
	<n-spin :show="model.loading.value">
		<div class="creative-container">
			<div class="title-container dark:bg-black bg-white">
				<div class="title">
					<n-text>创作中心</n-text>
				</div>
				<div class="max-w-[400px]">
					<n-input
						round
						placeholder="请输入模板名称"
						clearable
						v-model:value="model.searchVal.value"
						:on-input="presenter.handleOnSearch"
						@keydown.enter="presenter.handleOnSearch"
					>
						<template #prefix>
							<SvgIcon icon="uil:search" />
						</template>
						<template #suffix>
							<div class="cursor-pointer" @click="presenter.handleOnSearch">
								{{ $t("mjchat.search") }}
							</div>
						</template>
					</n-input>
				</div>
			</div>
			<div
				ref="classifyRef"
				class="classify-container flex justify-start line-clamp-1 pb-4 dark:bg-black bg-white"
			>
				<div
					class="m-1 cursor-pointer"
					v-for="item in model.classifyList.value"
					@click="presenter.handleOnSlectClassify(item)"
					:key="item"
				>
					<n-button
						v-if="item === '收藏'"
						strong
						round
						size="small"
						type="warning"
					>
						{{ item }}
					</n-button>
					<n-button
						strong
						round
						size="small"
						type="success"
						v-else-if="model.currentClassify.value == item"
					>
						{{ item }}
					</n-button>
					<n-button strong secondary round size="small" type="success" v-else>
						{{ item }}
					</n-button>
				</div>
			</div>
			<div
				class="create-item-list"
				:style="`${
					!model.isMobile.value ? 'padding-left:15px;padding-right:15px;' : ''
				}${'margin-top:' + (classifyHeight + 40) + 'px'}`"
			>
				<n-card
					:class="{
						web: !model.isMobile.value,
						mobile: model.isMobile.value,
					}"
					class="create-card"
					v-for="iten in model.creativeList.value"
					:key="iten.name"
					@click="presenter.handleOnCreate(iten)"
				>
					<div class="item">
						<div class="title">
							<span class="avatar">{{ iten.avatar }}</span>
							<n-text class="name">
								{{ iten.name }}
							</n-text>
						</div>
						<div class="desc">
							<n-text>{{ iten.description }}</n-text>
						</div>
					</div>
					<div class="item">
						<n-text class="price" type="error" />
					</div>
					<div class="collect" @click="presenter.handleOnCollect($event, iten)">
						<n-tag
							:type="
							model.collectList.value.includes(iten.id!) ? 'success' : 'warning'
						"
						>
							{{
								model.collectList.value.includes(iten.id!) ? "已收藏" : "收藏"
							}}
						</n-tag>
					</div>
				</n-card>
				<n-empty
					v-if="!model.creativeList.value.length"
					class="empty"
					description="暂无内容"
				/>
			</div>
		</div>
	</n-spin>
	<n-back-top :right="20" :bottom="80" />
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from "vue";

import { SvgIcon } from "@/components/common";

import { usePresenter } from "./presenter";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const classifyRef = ref<any>(null);

const classifyHeight = ref(0);

const presenter = usePresenter();
const { model } = presenter;
watch(
	() => model.classifyList.value,
	() => {
		console.log(
			"lassifyRef.value?.offsetHeight",
			classifyRef.value?.offsetHeight,
		);
		nextTick(() => {
			classifyHeight.value = classifyRef.value?.offsetHeight;
		});
	},
	{
		immediate: true,
	},
);
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
<style lang="less">
.n-layout-scroll-container {
	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
