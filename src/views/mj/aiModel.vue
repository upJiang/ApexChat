<script setup lang="ts">
import { NButton, NSelect, SelectOption, useMessage } from "naive-ui";
import { useModelStore } from "@/store/modelStore";
import { VNodeChild, ref, watch } from "vue";

import { chatSetting } from "@/api";
import { t } from "@/locales";
import { gptConfigStore, useChatStore } from "@/store";

const emit = defineEmits(["close"]);
const chatStore = useChatStore();
const uuid = chatStore.active;

const chatSet = new chatSetting(uuid == null ? 1002 : uuid);

const ms = useMessage();
const save = () => {
	gptConfigStore.setMyData(gptConfigStore.myData);
	ms.success(t("common.saveSuccess")); //'保存成功'
	emit("close");
};
const saveChat = () => {
	chatSet.save(gptConfigStore.myData);
	//gptConfigStore.setInit(); //恢复下默认
	gptConfigStore.myData.systemMessage = "";
	ms.success(t("common.saveSuccess"));
	emit("close");
};

const renderLabel = (option: SelectOption): VNodeChild => {
	return [option.label as string];
};

interface Props {
	visible?: boolean;
}

const props = defineProps<Props>();
// 当前选择的模型
const currentSelectModel = ref(gptConfigStore.myData.model || "");

watch(
	() => props.visible,
	() => {
		// 如果选了GPTS模型，将名字改成相对应即可
		if (
			props.visible &&
			gptConfigStore.myData?.gpts &&
			gptConfigStore.myData?.gpts?.name &&
			!useModelStore().modelList.find(
				(item) => item.value === gptConfigStore.myData.model,
			)
		) {
			currentSelectModel.value = gptConfigStore.myData.gpts.name;
		} else {
			currentSelectModel.value = gptConfigStore.myData.model || "";
		}
	},
	{
		immediate: true,
	},
);

const handelModelChange = (val: string) => {
	currentSelectModel.value = val;
	gptConfigStore.setMyData({ model: val, gptsType: undefined });
};
</script>
<template>
	<section
		class="mb-4 flex justify-between items-center"
		style="padding-bottom: 20px"
	>
		<div>
			<span class="text-red-500">*</span>
			{{ $t("mjset.model") }}
		</div>

		<n-select
			v-model:value="currentSelectModel"
			:options="useModelStore().modelList"
			size="small"
			class="!w-[50%]"
			placeholder="选择模型"
			style="min-width: 200px"
			:render-label="renderLabel"
			:on-update:value="handelModelChange"
		/>
	</section>

	<section class="text-right flex justify-end space-x-2">
		<NButton @click="gptConfigStore.setInit()">
			{{ $t("mj.setBtBack") }}
		</NButton>
		<NButton
			type="primary"
			@click="saveChat"
			v-if="
				useModelStore().modelList.find(
					(item) => item.value === currentSelectModel,
				)
			"
		>
			{{ $t("mj.setBtSaveChat") }}
		</NButton>
		<NButton
			v-if="
				useModelStore().modelList.find(
					(item) => item.value === currentSelectModel,
				)
			"
			type="primary"
			@click="save"
		>
			{{ $t("mj.setBtSaveSys") }}
		</NButton>
	</section>
</template>
