<template>
	<div class="w-full h-full" style="margin-top: 20px">
		<template v-if="gptsList.length > 0">
			<div
				ref="classifyRef"
				class="classify-container flex justify-start line-clamp-1 pb-4 dark:bg-black bg-white"
			>
				<div class="m-1 cursor-pointer" @click="onRecent">
					<n-button strong round size="small" type="warning">最近使用</n-button>
				</div>
				<div class="m-1 cursor-pointer" v-for="v in tag" @click="goSearch(v)">
					<n-button strong round size="small" type="success" v-if="v == pp.q">
						{{ v }}
					</n-button>
					<n-button strong secondary round size="small" type="success" v-else>
						{{ v }}
					</n-button>
				</div>
			</div>
			<div
				:style="`${'margin-top:' + (classifyRef?.offsetHeight + 40) + 'px'}`"
				class="list-container grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
			>
				<div
					@click="go(v)"
					v-for="v in gptsList"
					class="group relative flex gap-3 rounded-2xl bg-[#e8eaf1] p-5 dark:bg-neutral-600 cursor-pointer"
				>
					<div class="min-w-0 flex-1">
						<div class="flex justify-between items-center">
							<h3 class="transition text-lg font-semibold line-clamp-1">
								{{ v.name }}
							</h3>
							<n-tag
								type="success"
								size="small"
								round
								v-if="v.use_cnt && +v.use_cnt > 0"
							>
								<div class="flex items-center">
									<SvgIcon icon="mdi:hot" />
									{{ v.use_cnt }}
								</div>
							</n-tag>
						</div>
						<div class="mt-0.5 text-zinc-400 text-md line-clamp-2">
							{{ v.info }}
						</div>
						<n-text
							type="primary"
							style="cursor: pointer; width: fit-content"
							class="mt-0.5 text-zinc-400 text-md line-clamp-2"
							@click.stop="onDetailShow(v)"
						>
							查看详情
						</n-text>
					</div>
					<NImage
						:src="v?.logo"
						:preview-disabled="true"
						lazy
						class="group-hover:scale-[130%] duration-300 shrink-0 overflow-hidden bg-base object-cover rounded-full bc-avatar w-[80px] h-[80px]"
					>
						<template #placeholder>
							<div class="w-full h-full justify-center items-center flex">
								<SvgIcon
									icon="line-md:downloading-loop"
									class="text-[60px] text-green-300"
								/>
							</div>
						</template>
					</NImage>
					<!-- <img  class="group-hover:scale-[130%] duration-300 shrink-0 overflow-hidden bg-base object-cover rounded-full bc-avatar w-[80px] h-[80px]" :src="v.logo"/> -->
				</div>
			</div>
			<div class="flex items-center justify-center py-10" v-if="st.tab == ''">
				<div
					@click="pageLoad()"
					v-if="st.loadPage"
					:style="gptsList.length ? '' : 'margin-top:200px'"
				>
					{{ $t("mjchat.loading2") }}
				</div>
				<NButton @click="pageLoad()" v-else>
					{{ $t("mjchat.loadmore") }}
				</NButton>
			</div>
			<div style="height: 50px"></div>
		</template>
		<div
			class="list-container h-full flex items-center justify-center flex-col"
			v-else-if="(st.tab == 'search' && !st.search) || st.tab === 'recent'"
		>
			<div class="text-center" v-if="st.tab == 'search' && !st.search">
				{{ $t("mjchat.nofind") }}
				<b class="text-green-400">{{ st.q }}</b>
				{{ $t("mjchat.nofind2") }}
			</div>

			<div class="text-center" v-else-if="st.tab === 'recent'">
				您还未曾使用过任何应用，您可尝试以下内容
			</div>

			<div class="flex items-center justify-center flex-wrap">
				<div class="m-1 cursor-pointer" v-for="v in tag" @click="goSearch(v)">
					<n-button strong secondary round size="small" type="success">
						{{ v }}
					</n-button>
				</div>
			</div>
		</div>

		<div
			class="h-full flex items-center justify-center"
			v-else
			:style="gptsList.length ? '' : 'margin-top:200px'"
		>
			{{ $t("mjchat.loading2") }}
		</div>
	</div>

	<n-modal
		v-model:show="detailShow"
		:on-update:show="() => (detailShow = false)"
		style="width: 90%; max-width: 500px"
		preset="card"
		:closable="false"
	>
		<NImage
			:src="currtentGpts?.logo"
			:preview-disabled="true"
			lazy
			class="group-hover:scale-[130%] duration-300 shrink-0 overflow-hidden bg-base object-cover rounded-full bc-avatar w-[80px] h-[80px]"
		>
			<template #placeholder>
				<div class="w-full h-full justify-center items-center flex">
					<SvgIcon
						icon="line-md:downloading-loop"
						class="text-[60px] text-green-300"
					/>
				</div>
			</template>
		</NImage>
		<div class="min-w-0 flex-1">
			<div class="flex justify-between items-center">
				<h3 class="transition text-lg font-semibold line-clamp-1">
					{{ currtentGpts?.name }}
				</h3>
				<n-tag
					type="success"
					size="small"
					round
					v-if="currtentGpts?.use_cnt && +currtentGpts?.use_cnt > 0"
				>
					<div class="flex items-center">
						<SvgIcon icon="mdi:hot" />
						{{ currtentGpts?.use_cnt }}
					</div>
				</n-tag>
			</div>
			<div class="mt-0.5 text-zinc-400 text-md line-clamp-2">
				{{ currtentGpts?.info }}
			</div>
			<div class="mt-0.5 text-zinc-400 text-md line-clamp-2">
				模型：{{ currtentGpts?.gid }}
			</div>
			<div class="mt-0.5 text-zinc-400 text-md line-clamp-2">
				作者：{{ currtentGpts?.author_name || "未知" }}
			</div>
		</div>
	</n-modal>
</template>

<script setup lang="ts">
import { useGptsStore } from "@/store/gptsStore";
import { NButton, NImage, NTag, useMessage } from "naive-ui";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { gptsType, mlog, myFetch } from "@/api";
import { SvgIcon } from "@/components/common";
import { t } from "@/locales";
import { gptConfigStore, homeStore, useChatStore } from "@/store";

const router = useRouter();
const ms = useMessage();
const chatStore = useChatStore();
const emit = defineEmits(["close", "toq"]);
const pp = defineProps<{ q: string }>();
//const gptsList= ref<gptsType[]>([]);
const gptsPageList = ref<gptsType[]>([]);
const gptsInitList = ref<gptsType[]>([]);
const gptsSearchList = ref<gptsType[]>([]);
const st = ref({ loadPage: false, q: "", tab: "", search: false });
const tag = ref<string[]>([]);
const load = async () => {
	const gptUrl =
		homeStore.myData.session.gptUrl ?? "https://gpts.ddaiai.com/open/gpts";
	let d = await myFetch(gptUrl);
	gptsInitList.value = d.gpts as gptsType[];
	tag.value = d.tag as string[];
};
const go = async (item: gptsType) => {
	gptConfigStore.setMyData({
		model: `${item.gid}`,
		gpts: item,
		gptsType: "gpts",
	});
	ms.success(t("mjchat.success2"));
	const gptUrl = `https://gpts.ddaiai.com/open/gptsapi/use`;
	myFetch(gptUrl, item);
	emit("close");
	mlog("go local ", homeStore.myData.local);

	// 先判断是否存在改聊天记录
	let newUuid = 0;

	if (chatStore.history.find((item) => item.title === "应用商店对话")) {
		// 通过聊天名字去匹配，匹配不到则重新添加
		newUuid = chatStore.history.find(
			(item) => item.title === "应用商店对话",
		)!.uuid;
		chatStore.updateHistory(newUuid, {
			title: "应用商店对话",
			uuid: newUuid,
			isEdit: false,
			isGpts: true,
			model: `${item.gid}`,
			modelName: item.name,
		});
	} else {
		// 通过聊天名字去匹配，匹配不到则重新添加
		newUuid = chatStore.active ? Date.now() : 1002;
		chatStore.addHistory({
			title: "应用商店对话",
			uuid: newUuid,
			isEdit: false,
			isGpts: true,
			model: `${item.gid}`,
			modelName: item.name,
		});
	}
	chatStore.setActive(newUuid);
	// 添加到最近使用，最多十个
	const gptsptsStore = useGptsStore();
	const recentGpts = gptsptsStore.recentGpts;

	if (!recentGpts.find((it) => it.id === item.id)) {
		if (recentGpts.length >= 10) {
			recentGpts.pop();
		}
		recentGpts.unshift(item);
	}

	router.replace({ name: "Chat", params: { uuid: newUuid } });

	// 滚动到底部
	setTimeout(() => {
		homeStore.setMyData({ act: "scrollToBottom" });
	}, 500);
};
const pageLoad = async () => {
	st.value.loadPage = true;
	const gptUrl = `https://gpts.ddaiai.com/open/gptsapi/list/${gptsPageList.value.length}`;
	let d = await myFetch(gptUrl);
	st.value.loadPage = false;

	let rz = d.data.list as gptsType[];
	gptsPageList.value = gptsPageList.value.concat(rz); //rz.concat( gptsPageList.value  )
};
const gptsList = computed(() => {
	let rz: gptsType[] = [];
	if (st.value.tab === "search") {
		return gptsSearchList.value;
		//mlog('search', st.value.tab );
	}
	if (st.value.tab === "recent") {
		return useGptsStore().recentGpts;
		//mlog('search', st.value.tab );
	} else {
		return rz.concat(gptsInitList.value, gptsPageList.value);
	}
});
const searchQ = async (q: string) => {
	st.value.q = q;
	st.value.tab = "search";
	st.value.search = true;
	const gptUrl = `https://gpts.ddaiai.com/open/gptsapi/search?q=${st.value.q}`;
	let d = await myFetch(gptUrl);
	st.value.search = false;
	gptsSearchList.value = d.data.list as gptsType[];
};
const goSearch = (q: string) => {
	emit("toq", { q });
	searchQ(q);
};
watch(
	() => pp.q,
	(n) => {
		if (n == "") st.value.tab = "";
	},
);
load();
defineExpose({ searchQ });

const detailShow = ref(false);
const currtentGpts = ref<gptsType>();
const onDetailShow = (item: gptsType) => {
	currtentGpts.value = item;
	detailShow.value = true;
};

const classifyRef = ref(null);

// 切换到最近使用
const onRecent = () => {
	st.value.tab = "recent";
};
</script>

<style scoped lang="less">
.classify-container {
	position: absolute;
	top: 55px;
	left: 0px;
	z-index: 999;
	width: 100%;

	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	padding: 0px 10px 10px 10px;
}
.list-container {
	margin-top: 104px;
}
.text-center {
	text-align: center;
	margin-bottom: 20px;
}
</style>
