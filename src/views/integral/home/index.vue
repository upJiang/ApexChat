<template>
	<HeaderComponent onlyMenuShow showIntergtal v-if="isMobile" />
	<div class="intergral-tab-container">
		<n-tabs type="segment" animated v-model:value="model.currentTab.value">
			<n-tab-pane name="RulesAndBug" tab="使用文档">
				<RulesAndBug />
			</n-tab-pane>
			<n-tab-pane name="UseHistory" tab="积分历史">
				<UseHistory />
			</n-tab-pane>
			<n-tab-pane name="PriceIntro" tab="模型价格">
				<PriceIntro />
			</n-tab-pane>
		</n-tabs>
	</div>
</template>

<script lang="ts" setup>
import { useBasicLayout } from "@/hooks/useBasicLayout";
import HeaderComponent from "@/views/chat/components/Header/index.vue";

import PriceIntro from "./components/PriceIntro/index.vue";
import RulesAndBug from "./components/RulesAndBug/index.vue";
import UseHistory from "./components/UseHistory/index.vue";
import { usePresenter } from "./presenter";

const presenter = usePresenter();
const { model } = presenter;

const { isMobile } = useBasicLayout();
</script>

<style lang="less">
@import url("./index.less");
</style>
<style lang="less">
.intergral-tab-container {
	.n-tabs .n-tabs-nav {
		margin: 0 auto;
		width: 300px;
	}
}
</style>
