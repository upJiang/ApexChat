<template>
	<div v-if="!isMobile" class="flex-shrink-0 w-[60px] z-[1000] h-full">
		<div
			class="flex h-full select-none flex-col items-center justify-between bg-[#e8eaf1] px-2 pt-4 pb-8 dark:bg-[#25272d]"
		>
			<div class="flex flex-col space-y-4 flex-1">
				<a
					:href="`#/chat/${chatId}`"
					class="router-link-active router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]"
					@click="st.active = 'chat'"
				>
					<div
						class="flex h-full justify-center items-center py-1 flex-col"
						:class="[goHome == 'Chat' ? 'active' : '']"
					>
						<SvgIcon icon="ri:wechat-line" class="text-3xl flex-1" />
						<span class="text-[10px]">{{ $t("mjtab.chat") }}</span>
					</div>
				</a>
				<a
					class="router-link-active router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]"
					@click="handleCreativeShow"
				>
					<div
						class="flex h-full justify-center items-center py-1 flex-col"
						:class="[goHome == 'creative' ? 'active' : '']"
					>
						<SvgIcon icon="ri:wechat-line" class="text-3xl flex-1" />
						<span class="text-[10px]">创作</span>
					</div>
				</a>
				<a
					class="router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]"
					@click="() => router.push({ path: '/gpts' })"
				>
					<div
						:class="[goHome == 'gpts' ? 'active' : '']"
						class="flex h-full justify-center items-center py-1 flex-col"
					>
						<SvgIcon icon="ri:apps-fill" class="text-3xl flex-1" />
						<span class="text-[10px]">{{ $t("mjtab.GPTs") }}</span>
					</div>
				</a>

				<a
					:href="`#/draw/${chatId}`"
					class="router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]"
					@click="st.active = 'draw'"
				>
					<div
						class="flex h-full justify-center items-center py-1 flex-col"
						:class="[goHome == 'draw' ? 'active' : '']"
					>
						<SvgIcon icon="ic:outline-palette" class="text-3xl flex-1" />
						<span class="text-[10px]">{{ $t("mjtab.draw") }}</span>
					</div>
				</a>
				<!-- <a
					class="router-link-active router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]"
					@click="() => router.push({ path: '/gradio' })"
				>
					<div
						class="flex h-full justify-center items-center py-1 flex-col"
						:class="[goHome == 'gradio' ? 'active' : '']"
					>
						<SvgIcon icon="ri:wechat-line" class="text-3xl flex-1" />
						<span class="text-[10px]">Gradio</span>
					</div>
				</a> -->

				<!-- <a
					class="router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]"
					@click="homeStore.setMyData({ act: 'gallery' })"
				>
					<NTooltip placement="right" trigger="hover">
						<template #trigger>
							<div
								class="flex h-full justify-center items-center py-1 flex-col"
							>
								<SvgIcon
									icon="material-symbols:imagesmode-outline"
									class="text-3xl flex-1"
								/>
								<span class="text-[10px]">{{ $t("mjtab.gallery") }}</span>
							</div>
						</template>
						{{ $t("mjtab.galleryInfo") }}
					</NTooltip>
				</a> -->

				<!-- <section  class=" router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]"
             >
                <n-tooltip placement="right" trigger="hover">
                  <template #trigger>
                    <div  class="flex  h-full justify-center items-center py-1 flex-col ">
                      <SvgIcon icon="mingcute:grid-2-line" class="text-3xl flex-1"></SvgIcon>
                      <span class="text-[10px]">画廊</span>
                    </div>
                  </template>
                    画廊:看看别人是如何画的
                </n-tooltip>
            </section> -->
			</div>
			<div class="flex flex-col space-y-2">
				<NAvatar
					@click="handleUserInfoShow"
					v-if="userInfo.isLogin"
					size="large"
					round
					:src="userInfo.userHead || defaultAvatar"
					class="cursor-pointer"
				/>
				<HoverButton v-else-if="!userInfo.isLogin" @click="handleUserLogin">
					<n-button type="primary">
						<!-- 登录 -->
						{{ $t("login.login") }}
					</n-button>
				</HoverButton>
				<HoverButton @click="st.show = true">
					<div
						class="text-xl text-[#4f555e] dark:text-white flex h-full justify-center items-center"
					>
						<SvgIcon icon="ri:settings-4-line" />
					</div>
				</HoverButton>
			</div>
		</div>
	</div>
	<Setting v-model:visible="st.show" @cancel="st.show = false" />

	<!-- <n-drawer v-model:show="st.showImg" :placement="isMobile?'bottom':'right'"  :class="isMobile?['!h-[90vh]']: ['!w-[80vw]']" style="--n-body-padding:0">
    <n-drawer-content title="GPT store" closable>
      sdsd
    </n-drawer-content>
</n-drawer> -->
</template>

<script setup lang="ts">
import defaultAvatar from "@/assets/userHead.jpg";
import { NAvatar, NTooltip } from "naive-ui";
import { computed, defineAsyncComponent, ref, watch } from "vue";

import { HoverButton, SvgIcon } from "@/components/common";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { router } from "@/router";
import { homeStore, useChatStore, useUserStore } from "@/store";

const { isMobile } = useBasicLayout();

const chatStore = useChatStore();

const Setting = defineAsyncComponent(
	() => import("@/components/common/Setting/index.vue"),
);

const st = ref({ show: false, showImg: false, menu: [], active: "chat" });

const goHome = computed(() => {
	// router.push('/')
	return router.currentRoute.value.name;
});
// const go=(n:string)=>{
//   if('chat'==n){
//         router.push('/chat/'+ chatStore.active??'1002')
//     }
//     if('draw'==n){
//         router.push('/draw/'+ chatStore.active??'1002')
//         st.value.show=true;
//     }
// }
// mlog('g', goHome() );
const chatId = computed(() => chatStore.active ?? "1002");

// 登录
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

// 点击登录
const handleUserLogin = () => {
	router.push("/login");
};

const handleUserInfoShow = () => {
	router.push("/userInfo");
};

const showLogin = computed(() => userStore.showLogin);
watch(
	() => showLogin.value,
	() => {
		router.push("/login");
	},
);

// 打开创作
const handleCreativeShow = () => {
	router.push("/creative");
};
</script>
