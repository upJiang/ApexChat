<script setup lang="ts">
import { NConfigProvider } from "naive-ui";
import { watch } from "vue";

import { NaiveProvider } from "@/components/common";
import { useInit } from "@/hooks/useInit";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { useUserStore } from "@/store";
import { useModelStore } from "@/store/modelStore";

const { theme, themeOverrides } = useTheme();
const { language } = useLanguage();

// 监听到用户登录，初始化信息
const userStore = useUserStore();
watch(
	() => userStore.userInfo.isLogin,
	() => {
		if (userStore.userInfo.isLogin) {
			// 加个延迟等待缓存添加
			setTimeout(() => {
				useInit();
			}, 20);
		}
	},
	{ immediate: true },
);
// 进入拉取模型列表
const modelStore = useModelStore();
modelStore.loadModelList();
</script>

<template>
	<NConfigProvider
		class="h-full"
		:theme="theme"
		:theme-overrides="themeOverrides"
		:locale="language"
	>
		<NaiveProvider>
			<RouterView />
		</NaiveProvider>
	</NConfigProvider>
</template>
