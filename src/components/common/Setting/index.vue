<script setup lang="ts">
import { NModal, NTabPane, NTabs } from "naive-ui";
import { computed, ref } from "vue";

import { SvgIcon } from "@/components/common";
import { homeStore, useAuthStore } from "@/store";
import aiModel from "@/views/mj/aiModel.vue";

import General from "./General.vue";

const VITE_APP_ENVIRONMENT = import.meta.env.VITE_APP_ENVIRONMENT;

interface Props {
	visible: boolean;
}

interface Emit {
	(e: "update:visible", visible: boolean): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emit>();

const authStore = useAuthStore();

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI);

const active = ref("General");

const show = computed({
	get() {
		return props.visible;
	},
	set(visible: boolean) {
		emit("update:visible", visible);
	},
});
</script>

<template>
	<NModal
		v-model:show="show"
		style="width: 90%; max-width: 500px"
		preset="card"
	>
		<General
			v-if="VITE_APP_ENVIRONMENT === 'production'"
			@close="show = false"
		/>
		<NTabs v-model:value="active" type="line" animated v-else>
			<NTabPane name="General" tab="General">
				<template #tab>
					<SvgIcon class="text-lg" icon="ri:file-user-line" />
					<span class="ml-2">{{ $t("setting.general") }}</span>
				</template>
				<div class="min-h-[100px]">
					<General />
				</div>
			</NTabPane>

			<NTabPane v-if="isChatGPTAPI" name="Advanced" tab="Advanced">
				<template #tab>
					<SvgIcon class="text-lg" icon="ri:equalizer-line" />
					<span class="ml-2">{{ $t("mjset.model") }}</span>
				</template>
				<div class="min-h-[100px]">
					<aiModel />
				</div>
			</NTabPane>

			<NTabPane
				name="server"
				tab="server"
				v-if="!homeStore.myData.session.isHideServer"
			>
				<template #tab>
					<SvgIcon class="text-lg" icon="mingcute:server-line" />
					<span class="ml-2">{{ $t("mjset.server") }}</span>
				</template>
			</NTabPane>
		</NTabs>
	</NModal>
</template>
