<template>
	<div class="intergral-card-container">
		<n-card
			class="intergral-card"
			v-for="item in model.tableData.value"
			:key="item.modelName"
			:class="{
				web: !model.isMobile.value,
			}"
		>
			<div class="item">
				<n-text class="name">
					{{ item.modelType }}
				</n-text>
			</div>
			<div class="item">
				<n-text class="tips" style="color: rgba(0, 0, 0, 0.6); margin-top: 6px">
					{{ item.description }}
				</n-text>
			</div>
			<div class="item">
				<n-text class="tips">rpm：{{ item.rpm }}</n-text>
			</div>
			<div class="item">
				<n-text class="tips">token 最大限制：{{ item.tokenLimit }}</n-text>
			</div>
			<div class="item">
				<n-text class="tips">计费类型：{{ item.modelPricingType }}</n-text>
			</div>
			<div class="item">
				<n-text class="price" type="error">
					{{
						item.modelPricingType === "次数"
							? `每次消耗积分：${item.modelPrice}`
							: `每次消耗token：${item.modelPrice}`
					}}
				</n-text>
			</div>
		</n-card>
	</div>
</template>

<script lang="ts" setup>
import { usePresenter } from "./presenter";

const presenter = usePresenter();
const { model } = presenter;
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>
