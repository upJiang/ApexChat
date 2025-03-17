<template>
	<NLayoutSider
		:collapsed="collapsed"
		:collapsed-width="0"
		:width="260"
		:show-trigger="isMobile ? false : 'arrow-circle'"
		collapse-mode="transform"
		bordered
		:style="getMobileClass"
		@update-collapsed="handleUpdateCollapsed"
	>
		<div class="flex flex-col h-full" :style="mobileSafeArea">
			<main class="flex flex-col flex-1 min-h-0">
				<div class="p-4">
					<NButton dashed block @click="handleAdd">
						{{ $t("chat.newChatButton") }}
					</NButton>
				</div>
				<div class="flex-1 min-h-0 pb-4 overflow-hidden">
					<List />
				</div>

				<!-- <div class="flex items-center p-4 space-x-4">
					<div class="flex-1">
						<NButton block @click="show = true">
							{{ $t("store.siderButton") }}
						</NButton>
					</div>
					<NButton @click="handleClearAll">
						<SvgIcon icon="ri:close-circle-line" />
					</NButton>
				</div> -->
				<div class="flex items-center p-4 space-x-4">
					<div class="flex-1">
						<n-tooltip placement="top-start" trigger="click">
							<template #trigger>
								<NButton block>
									<template #icon>
										<SvgIcon
											icon="material-symbols-light:group-add-rounded"
											style="color: #23b120"
										/>
									</template>
									我要进群
								</NButton>
							</template>
							<div class="group-info">
								<div class="group-name">
									{{
										isMobile
											? "请长按保存或截图后，打开微信扫码进群"
											: "请使用微信扫码加入群聊"
									}}
								</div>

								<NImage
									src="https://black-pearl.oss-cn-shenzhen.aliyuncs.com/2024/04/01/c4e14d02-6b2a-43c2-8fd6-673ae6b5b9fa.jpg"
									object-fit="cover"
									class="group-img"
								/>
							</div>
						</n-tooltip>
					</div>
				</div>
				<div class="flex items-center p-4 space-x-4" style="padding-top: 0px">
					<div class="flex-1">
						<NButton block @click="handelIntegralShow">
							<template #icon>
								<SvgIcon
									icon="mdi:funnel-plus-outline"
									style="color: #23b120"
								/>
							</template>
							我的积分: {{ integralInfo.userIntegralInfo?.score || 0 }}
						</NButton>
					</div>
				</div>
				<div
					class="flex items-center p-4 space-x-4"
					v-if="isMobile"
					style="padding-top: 0px"
				>
					<div class="flex-1">
						<NButton block @click="settingModalShow = true">
							<template #icon>
								<SvgIcon icon="ri:settings-4-line" />
							</template>
							设置
						</NButton>
					</div>
				</div>

				<div
					class="flex items-center p-4 space-x-4"
					v-if="isMobile"
					style="padding-top: 0px"
				>
					<div class="flex-1">
						<div
							v-if="userInfo.isLogin"
							class="flex items-center between"
							style="justify-content: space-between"
						>
							<div class="flex items-center">
								<NAvatar
									size="large"
									round
									:src="userInfo.userHead || defaultAvatar"
									class="cursor-pointer"
								/>
								<div
									style="
										max-width: 90px;
										overflow: hidden;
										white-space: nowrap;
										text-overflow: ellipsis;
									"
									class="ml-2 font-bold"
								>
									{{ userInfo.userName || "ApexChat" }}
								</div>
							</div>

							<n-button
								class="ml-2"
								type="primary"
								size="small"
								@click="handleUserInfoShow"
							>
								查看信息
							</n-button>
						</div>

						<NButton block @click="handleUserLogin" v-else>
							<template #icon>
								<SvgIcon icon="mdi:login-variant" />
							</template>
							登录
						</NButton>
					</div>
				</div>
			</main>
		</div>
	</NLayoutSider>
	<template v-if="isMobile">
		<div
			v-show="!collapsed"
			class="fixed inset-0 z-40 w-full h-full bg-black/40"
			@click="handleUpdateCollapsed"
		></div>
	</template>
	<Setting
		v-model:visible="settingModalShow"
		@cancel="settingModalShow = false"
	/>
	<PromptStore v-model:visible="show" />
</template>

<script setup lang="ts">
import { NButton, NLayoutSider } from "naive-ui";
import type { CSSProperties } from "vue";
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { useModelStore } from "@/store/modelStore";
import defaultAvatar from "@/assets/userHead.jpg";
import { PromptStore, SvgIcon } from "@/components/common";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { t } from "@/locales";
import { router } from "@/router";
import {
	gptConfigStore,
	useAppStore,
	useChatStore,
	useUserStore,
} from "@/store";
import { useIntegralStore } from "@/store/modules/integral";

import List from "./List.vue";

const Setting = defineAsyncComponent(
	() => import("@/components/common/Setting/index.vue"),
);

const appStore = useAppStore();
const chatStore = useChatStore();

// const dialog = useDialog();

const { isMobile } = useBasicLayout();
const show = ref(false);

const collapsed = computed(() => appStore.siderCollapsed);

function handleAdd() {
	chatStore.addHistory({
		title: t("chat.newChatButton"),
		uuid: Date.now(),
		isEdit: false,
		isGpts: false,
		model: useModelStore().defaultModel,
		modelName: "Apex 基础版",
	});
	gptConfigStore.setMyData({
		model: useModelStore().defaultModel,
	});
	if (isMobile.value) appStore.setSiderCollapsed(true);
}

function handleUpdateCollapsed() {
	appStore.setSiderCollapsed(!collapsed.value);
}

const getMobileClass = computed<CSSProperties>(() => {
	if (isMobile.value) {
		return {
			position: "fixed",
			zIndex: 50,
			height: "100%",
		};
	}
	return {};
});

const mobileSafeArea = computed(() => {
	if (isMobile.value) {
		return {
			paddingBottom: "env(safe-area-inset-bottom)",
		};
	}
	return {};
});

watch(
	isMobile,
	(val) => {
		appStore.setSiderCollapsed(val);
	},
	{
		immediate: true,
		flush: "post",
	},
);

// 登录
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

// 点击登录
const handleUserLogin = () => {
	if (isMobile.value) {
		appStore.setSiderCollapsed(true);
	}
	router.push("/login");
};

const handleUserInfoShow = () => {
	if (isMobile.value) {
		appStore.setSiderCollapsed(true);
	}
	router.push("/userInfo");
};

// 设置弹窗
const settingModalShow = ref(false);

const showLogin = computed(() => userStore.showLogin);
watch(
	() => showLogin.value,
	() => {
		if (isMobile.value) {
			appStore.setSiderCollapsed(true);
		}
		router.push("/login");
	},
);

// 积分
const integralInfo = computed(() => useIntegralStore());
const handelIntegralShow = () => {
	if (isMobile.value) {
		appStore.setSiderCollapsed(true);
	}
	router.push("/integral/home");
};
</script>
<style scoped lang="less">
.group-info {
	width: 140px;
	display: flex;
	flex-direction: column;
	padding: 8px;
	.group-name {
		display: flex;
		flex-wrap: wrap;
		font-size: 14px;
		margin-bottom: 8px;
	}
}
.group-img {
	widows: 120px;
	height: 120px;
}
</style>
