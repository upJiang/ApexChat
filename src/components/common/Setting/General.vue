<script lang="ts" setup>
import { NButton, NPopconfirm, useMessage } from "naive-ui";
import { computed, getCurrentInstance, ref } from "vue";

import { SvgIcon } from "@/components/common";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { t } from "@/locales";
import { router } from "@/router";
import { useAppStore, useChatStore } from "@/store";
import type { Theme } from "@/store/modules/app/helper";
import { useUserStore } from "@/store/modules/user/index";
import { delCookie } from "@/utils/cookie";
import { getCurrentDate } from "@/utils/functions";
import { fetchUserLogout } from "@/views/user/userInfo/api";

const appStore = useAppStore();

const { isMobile } = useBasicLayout();

const ms = useMessage();

const theme = computed(() => appStore.theme);

const themeOptions: { label: string; key: Theme; icon: string }[] = [
	{
		label: "Auto",
		key: "auto",
		icon: "ri:contrast-line",
	},
	{
		label: "Light",
		key: "light",
		icon: "ri:sun-foggy-line",
	},
	{
		label: "Dark",
		key: "dark",
		icon: "ri:moon-foggy-line",
	},
];

function exportData(): void {
	const date = getCurrentDate();
	const data: string = localStorage.getItem("chatStorage") || "{}";
	const jsonString: string = JSON.stringify(JSON.parse(data), null, 2);
	const blob: Blob = new Blob([jsonString], { type: "application/json" });
	const url: string = URL.createObjectURL(blob);
	const link: HTMLAnchorElement = document.createElement("a");
	link.href = url;
	link.download = `chat-store_${date}.json`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function importData(event: Event): void {
	const target = event.target as HTMLInputElement;
	if (!target || !target.files) return;

	const file: File = target.files[0];
	if (!file) return;

	const reader: FileReader = new FileReader();
	reader.onload = () => {
		try {
			const data = JSON.parse(reader.result as string);
			localStorage.setItem("chatStorage", JSON.stringify(data));
			ms.success(t("common.success"));
			location.reload();
		} catch (error) {
			ms.error(t("common.invalidFileFormat"));
		}
	};
	reader.readAsText(file);
}

function clearData(): void {
	localStorage.removeItem("chatStorage");
	location.reload();
}

function handleImportButtonClick(): void {
	const fileInput = document.getElementById("fileInput") as HTMLElement;
	if (fileInput) fileInput.click();
}

// 退出登录加载
const logoutLoading = ref(false);
const userStore = useUserStore();
const message = useMessage();
const instance = getCurrentInstance();
const chatStore = useChatStore();
// 退出登录
const handleLogout = async () => {
	if (userStore.userInfo.isLogin) {
		try {
			logoutLoading.value = true;
			await fetchUserLogout();
			delCookie("access_token");
			message.success("退出登录成功");
			instance?.emit("close");
			userStore.resetUserInfo();
			router.replace("/chat/" + chatStore.active ?? "1002");
		} finally {
			logoutLoading.value = false;
		}
	} else {
		instance?.emit("close");
		router.replace("/login");
	}
};
</script>

<template>
	<div class="p-4 space-y-5 min-h-[200px]">
		<div class="space-y-6" style="position: relative">
			<div class="flex space-x-4" :class="isMobile && 'items-start'">
				<span class="flex-shrink-0 w-[70px]">聊天记录：</span>

				<div class="flex flex-wrap gap-2">
					<NButton size="small" @click="exportData">
						<template #icon>
							<SvgIcon icon="ri:download-2-fill" />
						</template>
						{{ $t("common.export") }}
					</NButton>

					<input
						id="fileInput"
						type="file"
						style="display: none"
						@change="importData"
					/>
					<NButton size="small" @click="handleImportButtonClick">
						<template #icon>
							<SvgIcon icon="ri:upload-2-fill" />
						</template>
						{{ $t("common.import") }}
					</NButton>

					<NPopconfirm placement="bottom" @positive-click="clearData">
						<template #trigger>
							<NButton size="small">
								<template #icon>
									<SvgIcon icon="ri:close-circle-line" />
								</template>
								{{ $t("common.clear") }}
							</NButton>
						</template>
						{{ $t("chat.clearHistoryConfirm") }}
					</NPopconfirm>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[60px]">主题：</span>
				<div class="flex flex-wrap items-center gap-2">
					<template v-for="item of themeOptions" :key="item.key">
						<NButton
							size="small"
							:type="item.key === theme ? 'primary' : undefined"
							@click="appStore.setTheme(item.key)"
						>
							<template #icon>
								<SvgIcon :icon="item.icon" />
							</template>
						</NButton>
					</template>
				</div>
			</div>
			<n-button
				@click="handleLogout"
				:loading="logoutLoading"
				style="position: absolute; right: 20px"
				:type="!userStore.userInfo.isLogin ? 'primary' : undefined"
			>
				{{ userStore.userInfo.isLogin ? "退出登录" : "登录" }}
			</n-button>
		</div>
	</div>
</template>
